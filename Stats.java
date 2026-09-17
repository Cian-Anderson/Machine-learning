/*
Author: Cian Anderson
Student Number: C22793219
Date: 17/04/2024

Description:
Class responsible for calculating statistics and making predictions based on the machine learning model.
It calculates statistics such as averages, standard deviations, and percentages based on the provided data.
Additionally, it predicts whether an instance (Review) is recommended or not using calculated likelihoods and probabilities.

*/

package machine_learning;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Stats {


    // Create two HashMaps to store probabilities and statistics.
    private final Map<String, Double> probabilities;
    private final Map<String, Double> statistics;

    // Constructor for initializing the probabilities and statistics maps.
    public Stats() {
        probabilities = new HashMap<>();
        statistics = new HashMap<>();
    }


    // Method to calculate and store Statistics for later use based off of the Instances (Reviews) provided
    public Map<String, Double> calculateStatistics(List<Instance> data) {

        int totalInstances = data.size();
        int totalRecommended = 0;

        // Count total recommended Instances (Reviews)
        for (Instance instance : data) {
            if (instance.isRecommended()) {
                totalRecommended++;
            }
        }

        // Calculate probability of being recommended and not recommended
        double probabilityRec = (double) totalRecommended / totalInstances;
        double probabilityNotRec = 1.0 - probabilityRec;

        // Store probabilities
        probabilities.put("recommended", probabilityRec);
        probabilities.put("not_recommended", probabilityNotRec);

        // Initialize variables for statistics
        int totalReviews = data.size();
        int recCount = 0;
        int notRecCount = 0;

        double totalHoursRec = 0;
        double totalHoursNotRec = 0;

        double totalLogHoursRec = 0;
        double totalLogHoursNotRec = 0;

        double pricePerHourRec = 0;
        double pricePerHourNotRec = 0;

        double logPricePerHourRec = 0;
        double logPricePerHourNotRec = 0;

        int winCountRec = 0;
        int macCountRec = 0;
        int linuxCountRec = 0;

        int winCountNotRec = 0;
        int macCountNotRec = 0;
        int linuxCountNotRec = 0;

        double sumSqDiffHoursRec = 0;
        double sumSqDiffHoursNotRec = 0;
        double sumSqDiffPricePerHourRec = 0;
        double sumSqDiffPricePerHourNotRec = 0;
        
        // Calculate statistics by running through each Instance (Individual Review)
        for (Instance instance : data) {
            double hoursPlayed = instance.getHoursPlayed();
            double pricePerHour = instance.getHourToPriceRatio();
            double hoursPlayedlog;
            double pricePerHourlog;

            // log hours played to get normal distribution
            if (hoursPlayed != 0) {
                hoursPlayedlog = Math.log(hoursPlayed);
            } else {
                // Set hoursPlayed to a default value to prevent Loging 0
                hoursPlayed = 0.0000001;
                hoursPlayedlog = 0.0000001;
            }

            // log pricePerHour to get normal distribution
            if (pricePerHour != 0) {
                pricePerHourlog = Math.log(pricePerHour);
            } else {
                // Set hoursPlayed to a default value to prevent Loging 0
                pricePerHour = 0.0000001; //default value
                pricePerHourlog = 0.0000001;
            }

            //count if recommended
            if (instance.isRecommended()) {
                recCount++;
                pricePerHourRec += pricePerHour;
                totalHoursRec += hoursPlayed;
                logPricePerHourRec += pricePerHourlog;
                totalLogHoursRec += hoursPlayedlog;


                if (instance.isWindows()) {
                    winCountRec++;
                }
                if (instance.isMac()) {
                    macCountRec++;
                }
                if (instance.isLinux()) {
                    linuxCountRec++;
                }
            } else { //count if Not recommended
                notRecCount++;
                pricePerHourNotRec += pricePerHour;
                totalHoursNotRec += hoursPlayed;
                logPricePerHourNotRec += pricePerHourlog;
                totalLogHoursNotRec += hoursPlayedlog;

                if (instance.isWindows()) {
                    winCountNotRec++;
                }
                if (instance.isMac()) {
                    macCountNotRec++;
                }
                if (instance.isLinux()) {
                    linuxCountNotRec++;
                }
            }
        }

        // Calculate average Log hours
        double avgLogHoursRec = recCount != 0 ? totalLogHoursRec / recCount : 0;
        double avgLogHoursNotRec = notRecCount != 0 ? totalLogHoursNotRec / notRecCount : 0;

        // Calculate average Log Price per Hour
        double avgLogPricePerHourRec = recCount != 0 ? logPricePerHourRec / recCount : 0;
        double avgLogPricePerHourNotRec = notRecCount != 0 ? logPricePerHourNotRec / notRecCount : 0;

        // Calculate average hours
        double avgHoursRec = recCount != 0 ? totalHoursRec / recCount : 0;
        double avgHoursNotRec = notRecCount != 0 ? totalHoursNotRec / notRecCount : 0;

        // Calculate average Price per Hour
        double avgPricePerHourRec = recCount != 0 ? pricePerHourRec / recCount : 0;
        double avgPricePerHourNotRec = notRecCount != 0 ? pricePerHourNotRec / notRecCount : 0;


        // Calculate percentages
        double percentRec = (double) recCount / totalReviews * 100;
        double percentNotRec = (double) notRecCount / totalReviews * 100;

        // Calculate platform percentages for recommended reviews
        double percentWinRec = ((double) winCountRec / totalReviews) * 100;
        double percentMacRec = ((double) macCountRec / totalReviews) * 100;
        double percentLinuxRec = ((double) linuxCountRec / totalReviews) * 100;

        // Calculate platform percentages for not recommended reviews
        double percentWinNotRec = ((double) winCountNotRec / totalReviews) * 100;
        double percentMacNotRec = ((double) macCountNotRec / totalReviews) * 100;
        double percentLinuxNotRec = ((double) linuxCountNotRec / totalReviews) * 100;

        // Calculate sum of squared differences for standard deviations
        for (Instance instance : data) {
            if (instance.isRecommended()) {
                sumSqDiffHoursRec += Math.pow(instance.getHoursPlayed() - avgHoursRec, 2);
                sumSqDiffPricePerHourRec += Math.pow(instance.getHourToPriceRatio() - avgPricePerHourRec, 2);
            } else {
                sumSqDiffHoursNotRec += Math.pow(instance.getHoursPlayed() - avgHoursNotRec, 2);
                sumSqDiffPricePerHourNotRec += Math.pow(instance.getHourToPriceRatio() - avgPricePerHourNotRec, 2);
            }
        }

        // Calculate standard deviations
        double stdDevHoursRec = recCount != 0 ? Math.sqrt(sumSqDiffHoursRec / recCount) : 0;
        double stdDevHoursNotRec = notRecCount != 0 ? Math.sqrt(sumSqDiffHoursNotRec / notRecCount) : 0;
        double stdDevPricePerHourRec = recCount != 0 ? Math.sqrt(sumSqDiffPricePerHourRec / recCount) : 0;
        double stdDevPricePerHourNotRec = notRecCount != 0 ? Math.sqrt(sumSqDiffPricePerHourNotRec / notRecCount) : 0;

        // Store statistics
        statistics.put("totalReviews", (double) totalReviews);
        statistics.put("recCount", (double) recCount);
        statistics.put("notRecCount", (double) notRecCount);
        statistics.put("percentRec", percentRec);
        statistics.put("percentNotRec", percentNotRec);

        statistics.put("avgLogHoursRec", avgLogHoursRec);
        statistics.put("avgLogHoursNotRec", avgLogHoursNotRec);
        statistics.put("avgLogPricePerHourRec", avgLogPricePerHourRec);
        statistics.put("avgLogPricePerHourNotRec", avgLogPricePerHourNotRec);

        statistics.put("avgHoursRec", avgHoursRec);
        statistics.put("avgHoursNotRec", avgHoursNotRec);
        statistics.put("avgPricePerHourRec", avgPricePerHourRec);
        statistics.put("avgPricePerHourNotRec", avgPricePerHourNotRec);

        statistics.put("stdDevHoursRec", stdDevHoursRec);
        statistics.put("stdDevHoursNotRec", stdDevHoursNotRec);
        statistics.put("stdDevPricePerHourRec", stdDevPricePerHourRec);
        statistics.put("stdDevPricePerHourNotRec", stdDevPricePerHourNotRec);

        statistics.put("percentWinRec", percentWinRec);
        statistics.put("percentMacRec", percentMacRec);
        statistics.put("percentLinuxRec", percentLinuxRec);
        statistics.put("percentWinNotRec", percentWinNotRec);
        statistics.put("percentMacNotRec", percentMacNotRec);
        statistics.put("percentLinuxNotRec", percentLinuxNotRec);

        return statistics;
    }

    // Method to predict if an Instance (Review) is Recommended or not based on calculated likelihoods and probabilities.
    public boolean predict(Instance instance) {
        // initiate likelihoods as 100% likely
        double likelihoodRecommended = 1.0;
        double likelihoodNotRecommended = 1.0;

        // Calculate likelihood based on Instance (Review) Data using calculateLikelihood methods
        likelihoodRecommended *= calculateRecommendedLikelihood (instance.getHoursPlayed(), instance.getHourToPriceRatio(), instance.isWindows(), instance.isMac(), instance.isLinux());
        likelihoodNotRecommended *= calculateNotRecommendedLikelihood (instance.getHoursPlayed(), instance.getHourToPriceRatio(), instance.isWindows(), instance.isMac(), instance.isLinux());

        // Calculate posterior probabilities
        double posteriorRecommended = likelihoodRecommended * probabilities.get("recommended");
        double posteriorNotRecommended = likelihoodNotRecommended * probabilities.get("not_recommended");

        // Determine which is more Likely to be True
        return posteriorRecommended > posteriorNotRecommended;
    }

    // Method to calculate likelihood of features given class
    private double calculateRecommendedLikelihood(double hoursPlayed, double hourToPriceRatio, boolean windows, boolean mac, boolean linux) {
        // Retrieve Relevant statistics
        double percentRec = statistics.get("percentRec");
        double avgHoursRec = statistics.get("avgLogHoursRec");
        double percentWinRec = statistics.get("percentWinRec");
        double percentMacRec = statistics.get("percentMacRec");
        double percentLinuxRec = statistics.get("percentLinuxRec");
        double stdDevHoursRec = statistics.get("stdDevHoursRec");
        double stdDevPricePerHourRec = statistics.get("stdDevPricePerHourRec");

        // Convert hours played to log form
        double HoursPlayed = Math.log(hoursPlayed) ;

        // Likelihood of hours played | Recommended
        // P(H∣recommended)= 1/(√2π⋅stdDevHoursRec) * e^−( (2*stdDevHoursRec)^2 / (h−avgHoursRec)^2 )
        double H_exponent = -Math.pow((HoursPlayed - avgHoursRec), 2) / (2 * Math.pow(stdDevHoursRec, 2));
        double hoursPlayedNotRec = (1 / (Math.sqrt(2 * Math.PI) * stdDevHoursRec)) * Math.exp(H_exponent);

        // Likelihood of avgPricePerHour | Recommended
        // P(PperH∣recommended)= 1/(√2π*stdDevPricePerHourRec) * e^−( (2*stdDevPricePerHourRec)^2 / (h−avgHoursRec)^2 )
        double PperH_exponent = -Math.pow((hourToPriceRatio - avgHoursRec), 2) / (2 * Math.pow(stdDevPricePerHourRec, 2));
        double pricePerHourRec = (1 / (Math.sqrt(2 * Math.PI) * stdDevPricePerHourRec)) * Math.exp(PperH_exponent);

        // Likelihood of Windows | Recommended
        double likelihoodWinGivenRec;
        if (windows) {
            likelihoodWinGivenRec = percentWinRec / 100.0;
        } else {
            likelihoodWinGivenRec = 1 - (percentWinRec / 100.0);
        }

        // Likelihood of mac | Recommended
        double likelihoodMacGivenRec;
        if (mac) {
            likelihoodMacGivenRec = percentMacRec / 100.0;
        } else {
            likelihoodMacGivenRec = 1 - (percentMacRec / 100.0);
        }

        // Likelihood of Linux | Recommended
        double likelihoodLinuxGivenRec;
        if (linux) {
            likelihoodLinuxGivenRec = percentLinuxRec / 100.0;
        } else {
            likelihoodLinuxGivenRec = 1 - (percentLinuxRec / 100.0);
        }

        // Likelihood of Being Recommended
        return (percentRec / 100) * hoursPlayedNotRec * pricePerHourRec * likelihoodWinGivenRec * likelihoodMacGivenRec * likelihoodLinuxGivenRec;
    }

    private double calculateNotRecommendedLikelihood(double hoursPlayed, double hourToPriceRatio, boolean windows, boolean mac, boolean linux) {
        // Retrieve Relevant statistics
        double percentRec = statistics.get("percentRec");
        double avgHoursRec = statistics.get("avgLogHoursRec");
        double percentWinNotRec = statistics.get("percentWinNotRec");
        double percentMacNotRec = statistics.get("percentMacNotRec");
        double percentLinuxNotRec = statistics.get("percentLinuxNotRec");
        double stdDevHoursNotRec = statistics.get("stdDevHoursNotRec");
        double stdDevPricePerHourRec = statistics.get("stdDevPricePerHourRec");

        // Convert hours played to log form
        double HoursPlayed = Math.log(hoursPlayed);

        // Likelihood of hours played | Not Recommended
        // P(H∣Notrecommended)= 1/(√2π⋅stdDevHoursNotRec) * e^−( (2*stdDevHoursNotRec)^2 / (h−avgHoursNotRec)^2 )
        double H_exponent = -Math.pow((HoursPlayed - avgHoursRec), 2) / (2 * Math.pow(stdDevHoursNotRec, 2));
        double hoursPlayedNotRec = (1 / (Math.sqrt(2 * Math.PI) * stdDevHoursNotRec)) * Math.exp(H_exponent);

        // Likelihood of avgPricePerHour | Not Recommended
        // P(PperH∣Notrecommended)= 1/(√2π*stdDevPricePerHourNotRec) * e^−( (2*stdDevPricePerHourNotRec)^2 / (h−avgHoursNotRec)^2 )
        double PperH_exponent = -Math.pow((hourToPriceRatio - avgHoursRec), 2) / (2 * Math.pow(stdDevPricePerHourRec, 2));
        double pricePerHourNotRec = (1 / (Math.sqrt(2 * Math.PI) * stdDevPricePerHourRec)) * Math.exp(PperH_exponent);

        // Likelihood of Windows | Not Recommended
        double likelihoodWinGivenNotRec;
        if (windows) {
            likelihoodWinGivenNotRec = percentWinNotRec / 100.0;
        } else {
            likelihoodWinGivenNotRec = 1 - (percentWinNotRec / 100.0);
        }

        // Likelihood of mac | Not Recommended
        double likelihoodMacGivenNotRec;
        if (mac) {
            likelihoodMacGivenNotRec = percentMacNotRec / 100.0;
        } else {
            likelihoodMacGivenNotRec = 1 - (percentMacNotRec / 100.0);
        }

        // Likelihood of Linux | Not Recommended
        double likelihoodLinuxGivenNotRec;
        if (linux) {
            likelihoodLinuxGivenNotRec = percentLinuxNotRec / 100.0;
        } else {
            likelihoodLinuxGivenNotRec = 1 - (percentLinuxNotRec / 100.0);
        }

        // Likelihood of Being Not Recommended
        return (percentRec / 100) * hoursPlayedNotRec * pricePerHourNotRec * likelihoodWinGivenNotRec * likelihoodMacGivenNotRec * likelihoodLinuxGivenNotRec;
    }
}