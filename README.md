# Machine Learning Project: Game Recommendation System

This README documents a machine learning project aimed at building a game recommendation system based on user reviews and game statistics. The system utilises a dataset of game reviews to train and validate machine learning models for predicting game recommendations.

## Table of Contents

Machine Learning Project: Game Recommendation System.
  - Table of Contents
  - Personal Goal
  - Project Goal
  - Classes
  - Outputs
  - Dataset
  - Models
  - Post-project Reflection
  - Helpful / Used Resources

## Personal Goal
My personal goals for this Project were to gain an understanding of machine learning, build on 0 prior knowledge, and improve my "Java" skills using a wide variety of Object-orientated techniques. 

## Project Goal
The Project aimed to create an accurate machine learning model that could predict whether a user would recommend a game, given factors such as hours played, price paid, and platform information.

## Classes
The Project consists of 6 .java files:
- **'Main.Java':** This is the Project's main controller class. It is responsible for reading the Data from the three .csv files for use in other Classes. It is also responsible for calling other external Classes such as calculating statistics, validating Data, Test Data and my two pop-up windows, Game Input and Statistics Display.
- **'Stats.Java':** This class is responsible for all of the maths contained within the Project. It does this in 2 steps. Firstly, it creates 2 Hash maps for probability and statistics. These are then filled with information such as averages, totals, Standard deviations and percentages. (One thing to note is that hours and Prices per hour had to be logged. This was to create a normal distribution of data as both were initially skewed heavily to the left). The second step was to take the Statistics generated in the hash maps and put them into my Classifer (Gaussian Naive Bayes Classifer). This calculates the likelihood that a specific recommendation will be either Recommended or Not Recommended. Whichever probability was higher is then set to the Models Guess.
- **'Instance.Java':** This sets up Instances that will hold individual rows of Data (Individual Reviews). The point of doing this is to make handling information related to specific reviews easier.
-  **'Validation.Java':** This class uses data from Validation.csv (Read in Main). Its purpose is to help fine-tune the model. It calls the Predict method (form 'Stats.Java') to pass in individual Reviews and compare the predicted result with the actual result as seen in the data, giving an accuracy %. The closer to 100% this accuracy is, the better the model has performed. This class was used heavily in developing Stats classes, particularly the calculation likelihood methods.
- **'Tester.Java':** This class uses data from Training.csv (Read in Main). This functions much like Validation.Java. However, its purpose is to test the model after completion. It generates an accuracy % much like validation, and the success is measured not by how close it is to 100% but if it is similar to the Validation accuracy ( this shows that the model is consistent)

## Outputs
The Project Creates two pop-up windows.
- **Game Input GUI**: Allows users to input information such as hours played, price, and platform of use to determine if a user with similar information will recommend a game or not
- **Statistics Display**: Provides users with statistical insights into the calculated data, including average hours played, average price per hour, and platform distribution among recommended and not recommended games.

 **Testing and Validation**: After running the program, it outputs the accuracy of the model

## Dataset
The Project uses a Large data set of Steam game reviews. It was divided into three distinct sections randomly.
- **Training** 60% of the original Data. This data is used to train the model and gain the statistics used in predictions.
- **Validation** 20% of the original Data. This data is used to check and improve the Machine Learning model.
- **Testing** 20% of the original Data. This data is used to test the prediction accuracy of the machine-learning model versus whether it is recommended or not.

The dataset was sourced from Kaggle and underwent preprocessing steps to handle missing values, convert categorical variables into a suitable format for machine learning models and remove irrelevant data.

## Models

The Project utilises a machine learning model, specifically a Gaussian Naive Bayes classifier, to predict game recommendations based on the input features. The Gaussian Naive Bayes classifier is trained on the dataset to predict new instances.

****Gaussian Naive Bayes:****
- It is based on Bayes' theorem, which describes the probability of an event based on prior knowledge of conditions that might be related to the event.
- The algorithm assumes that the continuous values associated with each class follow a Gaussian (normal) distribution, which may require logging the data to normalise it.
- The continuous attribute values' mean (μ) and variance (σ²) are computed for each class. These represent the central tendency and spread of the data within each class.
- Once the mean and variance for each class are known, the probability density of a given observation value (v) within a specific class (Cₖ) can be calculated. This is done by plugging the observation value (v) into the equation for a normal distribution with parameters μₖ and σ²ₖ.

**The probability density function for a normal distribution is given by:**

![image](https://github.com/cian-collage/oop-machine-learning/assets/124142292/73dcfc4f-40a2-45bf-8201-9ee2421c4f03)

Where:
- **p(x=v∣Cₖ** is the probability density of observing the value V given class Cₖ.
- **μₖ** is the mean of the values associated with class Cₖ.
- **μₖ^2** is the variance of the values associated with class Cₖ.
  
After the data is put through the classifier to find the probability of an instance being recommended and not recommended, the model takes the more significant probability and declares it as its prediction. This prediction is then compared to the actual result as seen in the `Testeing.csv` and `Validation.csv`, allowing for a test of accuracy.

![image](https://github.com/cian-collage/oop-machine-learning/assets/124142292/e4a91710-aaa4-48ec-8a5b-eca369a4c759)

## Post-project Reflection

Looking back on the Project, I made a few mistakes. Here are a few things I would do differently:
1. I would spend more time trying to understand the basics of machine learning, such as training, validation and testing. This caused me to have to restart the code for the Project as I needed to understand the end goal.
2. I would do more research into naive Bayes, as it took me a long time to understand how it works. In particular, my lack of understanding in the validation step caused many setbacks as I tried to fix the maths.
3. I would choose a more straightforward Data set for my first machine learning project. The self-introduction of continuous variables complicated much of my code in the mid to late stages of the Project.
4. I would make Git commits earlier in the coding process as my laptop died mid-project, and I lost much of my progress, particularly my original cleaned data sets.

## Helpful / Used Resources
- [[Normal distribution image sourse](https://www.slideshare.net/plummer48/normal-and-non-normal-distributions)]: Image of Normal and Skewed distributions.
- [[Naive Bayes classifier wiki](https://en.wikipedia.org/wiki/Naive_Bayes_classifier#Gaussian_naive_Bayes)]: Wikipedia page on Naive Bayes classifier and its variations.
- [[info video 1](https://www.youtube.com/watch?v=H3EjCKtlVog)]: Vidio by StatQuest with Josh Starmer on Gaussian Naive Bayes, Clearly Explained.
- [[info video 2](https://www.youtube.com/watch?v=u5jRUg10bpw)]: Vidio by Intellipaat on What is Gaussian Naive Bayes Algorithm / Gaussian Naive Bayes Implementation.
- [[kaggle](https://www.kaggle.com/datasets?search=Game)]: A website where many databases can be found on an extensive range of topics.
