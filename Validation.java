/*
Author: Cian Anderson
Student Number: C22793219
Date: 17/04/2024

Description:
This class contains a method for validating the performance of a classifier using a validation dataset.
*/

package machine_learning;

import java.util.List;

public class Validation {

    // Method to validate the classifier
    public static void validate(Stats classifier, List<Instance> validationData) {
        int correctPredictions = 0; // Counter to store the number of correct predictions
        int totalInstances = validationData.size(); // Total number of instances in the validation data

        // Validate each instance
        for (Instance instance : validationData) { // Loop through each instance in the validation data

            boolean actualRecommendation = instance.isRecommended(); // Get the actual recommendation status of the instance
            boolean predictedRecommendation = classifier.predict(instance); // Get the predicted recommendation status from the classifier
            // Check if prediction is correct
            if (actualRecommendation == predictedRecommendation) { // Compare actual and predicted recommendations
                correctPredictions++; // Increment the correct predictions counter if they match
            }
        }

        // Calculate accuracy
        double accuracy = (double) correctPredictions / totalInstances * 100; // Calculate the accuracy as a percentage
        System.out.println("\n"+"Validation Accuracy: " + accuracy + "%"+"\n"); // Print the validation accuracy
    }
}
