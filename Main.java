/*
Author: Cian Anderson
Student Number: C22793219
Date: 17/04/2024

Description:
Main/Control class for the machine learning project.
It reads data from CSV files containing training, validation, and testing data.
It calculates statistics for the model based on the training data,
evaluates the model's performance on validation and testing datasets,
and displays a graphical user interface (GUI) for inputting game data and viewing statistics.

*/

package machine_learning;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.swing.*;

public class Main {

    // read data from Training CSV file
    static List<Instance> readData() {
        List<Instance> instances = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader("Training.csv"))) {
            String line;
            // Skip header line
            br.readLine();
            // Read each line of the CSV file
            while ((line = br.readLine()) != null) {
                // Split the line by commas to get the values into an array
                String[] values = line.split(",");

                // Extract relevant features depending on their position in the array
                double hoursPlayed = Double.parseDouble(values[4]);
                double price = Double.parseDouble(values[5]);
                double hourToPrice = (hoursPlayed == 0) ? 0 : hoursPlayed / price;
                boolean windows = Integer.parseInt(values[7]) == 1;
                boolean mac = Integer.parseInt(values[8]) == 1;
                boolean linux = Integer.parseInt(values[9]) == 1;
                boolean recommended = Integer.parseInt(values[10]) == 1;

                // Create an Instance (individual review) with the data
                Instance instance = new Instance(hoursPlayed, hourToPrice, windows, mac, linux, recommended);
                // Add the instance to the list
                instances.add(instance);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return instances;
    }

    // read data from Validation CSV file
    private static List<Instance> readValidationData() {
        List<Instance> validationInstances = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader("Validation.csv"))) {
            String line;
            // Skip header line
            br.readLine();
            // Read each line of the CSV file
            while ((line = br.readLine()) != null) {
                // Split the line by commas to get the values into an array
                String[] values = line.split(",");

                // Extract relevant features depending on their position in the array
                double hoursPlayed = Double.parseDouble(values[4]);
                double price = Double.parseDouble(values[5]);
                double hourToPrice = (hoursPlayed == 0) ? 0 : Math.log(hoursPlayed / price);
                boolean windows = Integer.parseInt(values[7]) == 1;
                boolean mac = Integer.parseInt(values[8]) == 1;
                boolean linux = Integer.parseInt(values[9]) == 1;
                boolean recommended = Integer.parseInt(values[10]) == 1;

                // Create an Instance (individual review) with the data
                Instance instance = new Instance(hoursPlayed, hourToPrice, windows, mac, linux, recommended);
                // Add the instance to the list
                validationInstances.add(instance);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return validationInstances;
    }

    // read data from Testing CSV file
    private static List<Instance> readTestingData() {
        List<Instance> testingInstances = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader("Testing.csv"))) {
            String line;
            // Skip header line
            br.readLine();
            // Read each line of the CSV file
            while ((line = br.readLine()) != null) {
                // Split the line by commas to get the values into an array
                String[] values = line.split(",");

                // Extract relevant features depending on their position in the array
                double hoursPlayed = Double.parseDouble(values[4]);
                double price = Double.parseDouble(values[5]);
                double hourToPrice = (hoursPlayed == 0) ? 0 : Math.log(hoursPlayed / price);
                boolean windows = Integer.parseInt(values[7]) == 1;
                boolean mac = Integer.parseInt(values[8]) == 1;
                boolean linux = Integer.parseInt(values[9]) == 1;
                boolean recommended = Integer.parseInt(values[10]) == 1;

                // Create an Instance (individual review) with the data
                Instance instance = new Instance(hoursPlayed, hourToPrice, windows, mac, linux, recommended);
                // Add the instance to the list
                testingInstances.add(instance);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return testingInstances;
    }


    public static void main(String[] args) {
        // Read data from CSV file
        List<Instance> data = readData();

        // Calculate statistics for model
        Stats classifier = new Stats();
        classifier.calculateStatistics(data);
        Map<String, Double> statistics = classifier.calculateStatistics(data);

        // Test Model Quality on Validation Data
        List<Instance> validationData = readValidationData(); // Read validation data
        Validation.validate(classifier, validationData); // Validate the classifier

        // Test Prediction accuracy on Testing Data
        List<Instance> TestingData = readTestingData(); // Read Testing data
        Tester.Test(classifier, TestingData); // Test the classifier

        // Display GameInputGUI and statistics in separate windows
        SwingUtilities.invokeLater(() -> {
            GUI.GameInputGUI gameInputGUI = new GUI.GameInputGUI();
            gameInputGUI.setLocation(0, 0); // Set the location to x = 0 ,y = 0
        });
        SwingUtilities.invokeLater(() -> {
            GUI.StatisticsDisplay statisticsDisplay = new GUI.StatisticsDisplay(statistics);
            statisticsDisplay.setLocation(0, 200); // Set location to below GameInputGUI
        });
    }

}
