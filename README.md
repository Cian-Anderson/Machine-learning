# Steam Game Recommendation Predictor

> **A Java machine learning project that implements a Gaussian Naive Bayes classifier to predict whether a player is likely to recommend a Steam game based on playtime, price, and platform information.**

This project was developed to learn the fundamentals of **machine learning and object-oriented programming in Java**.

Rather than relying on an external machine learning library, the classifier logic is implemented directly in Java. The project reads Steam review data from CSV files, calculates the statistics required by a Gaussian Naive Bayes model, validates and tests the classifier, and provides a simple Swing interface for making new predictions.

## Project Goal

The aim of the project is to predict whether a user is likely to **recommend or not recommend a game** using information such as:

- Hours played
- Price / hours-to-price relationship
- Windows support
- macOS support
- Linux support

The project was also used as an introduction to:

- Machine learning concepts
- Training, validation, and testing datasets
- Probability-based classification
- Gaussian distributions
- Java collections
- Object-oriented design
- Desktop GUI development with Swing

---

## Machine Learning Model

The project implements a **Gaussian Naive Bayes classifier**.

The classifier calculates statistics from the training data for both recommendation classes:

```text
Recommended
Not Recommended
```

These statistics include:

- Class probabilities
- Mean hours played
- Mean price-per-hour values
- Standard deviations
- Platform percentages
- Log-transformed continuous values

For a new game-review instance, the classifier calculates the likelihood of the supplied features belonging to each class and combines these values with the prior probability of each class.

```text
Input Features
      ↓
Calculate Feature Likelihoods
      ↓
Recommended Probability
        vs
Not Recommended Probability
      ↓
Highest Probability Selected
      ↓
Prediction
```

The model's prediction is then returned as either:

```text
Recommended
```

or:

```text
Not Recommended
```

---

## Dataset

The project uses a dataset of **Steam game reviews**.

The original dataset was divided into three sections:

| Dataset | Split | Purpose |
|---|---:|---|
| Training | 60% | Calculate model statistics and train the classifier |
| Validation | 20% | Evaluate and refine the model during development |
| Testing | 20% | Measure the performance of the completed classifier |

The data was preprocessed before use to remove irrelevant information and convert values into a form suitable for the classifier.

Because the dataset files are too large to store directly in the GitHub repository, they are available separately:

[Download / View the Dataset](https://drive.google.com/drive/folders/1enufBe_7Sh8CKnDgMJ1v9yDIrT3nkxWt?usp=sharing)

The application expects the following files when running:

```text
Training.csv
Validation.csv
Testing.csv
```

---

## Features Used

Each review is represented by an `Instance` containing:

```text
Hours Played
Hours-to-Price Ratio
Windows
macOS
Linux
Recommended / Not Recommended
```

Continuous values are transformed where required to reduce skew and better fit the assumptions of the Gaussian model.

---

## Validation and Testing

The project separates model development from final testing.

### Validation

`Validation.java` runs the classifier against the validation dataset and compares:

```text
Predicted Recommendation
          vs
Actual Recommendation
```

The result is reported as an accuracy percentage.

### Testing

`Tester.java` performs the same comparison using the separate testing dataset.

This allows the final classifier to be evaluated against data that was not used to calculate the training statistics.

---

## Desktop Interface

The project includes a Java Swing interface with two windows.

### Game Input

The prediction interface allows a user to enter:

- Hours played
- Game price
- Windows support
- macOS support
- Linux support

The application converts the input into an `Instance`, passes it through the classifier, and displays the resulting recommendation prediction.

### Statistics Display

A second window displays statistics calculated from the training data, including:

- Total number of reviews
- Recommended / not recommended counts
- Recommendation percentages
- Average hours played
- Average price per hour
- Platform distribution for each class

---

## Application Flow

```text
Load Training.csv
       ↓
Create Review Instances
       ↓
Calculate Training Statistics
       ↓
Build Gaussian Naive Bayes Classifier
       ↓
Validate with Validation.csv
       ↓
Test with Testing.csv
       ↓
Launch Swing Interface
       ↓
Enter New Game Data
       ↓
Generate Recommendation Prediction
```

---

## Project Structure

```text
.
├── Main.java
├── Stats.java
├── Instance.java
├── Validation.java
├── Tester.java
├── GUI.java
├── Link to Data.txt
├── .gitattributes
└── README.md
```

### `Main.java`

Controls the overall application.

Responsibilities include:

- Reading the training, validation, and testing CSV files
- Converting rows into `Instance` objects
- Calculating model statistics
- Running validation
- Running final testing
- Launching the Swing interfaces

### `Stats.java`

Contains the core machine learning implementation.

It:

- Calculates model statistics
- Stores probabilities and statistical values
- Calculates Gaussian likelihoods
- Combines likelihoods with class probabilities
- Predicts whether a review is recommended

### `Instance.java`

Represents an individual game review and stores the features used by the classifier.

### `Validation.java`

Measures prediction accuracy using the validation dataset.

### `Tester.java`

Measures final prediction accuracy using the testing dataset.

### `GUI.java`

Contains the Java Swing user interface for:

- Entering new game information
- Displaying recommendation predictions
- Viewing statistics calculated from the training data

---

## Technologies

| Area | Technology |
|---|---|
| Language | Java |
| Machine Learning | Custom Gaussian Naive Bayes implementation |
| User Interface | Java Swing |
| Data Format | CSV |
| Data Structures | Lists and HashMaps |
| Dataset | Steam game reviews |

No external machine learning framework is required for the classifier itself.

---

## Running the Project

### Requirements

- Java Development Kit (JDK)
- The three dataset CSV files:
  - `Training.csv`
  - `Validation.csv`
  - `Testing.csv`

Place the CSV files in the application's working directory.

The source files use the package:

```java
package machine_learning;
```

Compile the Java files and run:

```text
machine_learning.Main
```

When the application starts it will:

1. Load the datasets
2. Calculate the training statistics
3. Print validation accuracy
4. Print testing accuracy
5. Open the prediction interface
6. Open the statistics display

---

## What I Built

For this project, I implemented the:

- Java data-loading pipeline
- Review data model
- Statistical calculations
- Gaussian Naive Bayes classifier
- Training / validation / testing workflow
- Accuracy evaluation
- Swing prediction interface
- Swing statistics display

The project was my introduction to machine learning and gave me practical experience implementing a classifier from the underlying probability and statistical concepts rather than treating the model as a black-box library call.

---

## Limitations

This was an introductory machine learning project and has several limitations.

- The classifier uses a relatively small set of hand-selected features
- Model assumptions are simplified
- Feature preprocessing is implemented manually
- Evaluation is based primarily on prediction accuracy
- The Swing interface is intentionally simple
- The project does not use a dedicated ML framework or production data pipeline

These limitations reflect the project's primary goal: understanding the mechanics of a machine learning classifier and implementing those mechanics directly in Java.
