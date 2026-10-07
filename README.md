# Steam Game Recommendation Predictor

> **A Java machine learning project that implements a Gaussian Naive Bayes classifier to predict whether a player is likely to recommend a Steam game based on playtime, price, and platform information.**

This project was developed as a self-learning project to understand the fundamentals of **machine learning and object-oriented programming in Java**.

Rather than relying on an external machine learning library, the classifier logic is implemented directly in Java. The project reads Steam review data from CSV files, calculates the statistics required by a Gaussian Naive Bayes model, validates and tests the classifier, and provides a simple Swing interface for making new predictions.

The goal was not to build a production-ready recommendation system, but to understand how a machine learning classifier works internally by implementing the probability calculations, data processing, validation, and prediction logic myself.

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
- Data preprocessing
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

### Understanding Gaussian Naive Bayes

As this was my first machine learning project, part of the development process involved learning how Gaussian Naive Bayes actually works rather than simply calling an existing machine learning library.

Naive Bayes is based on **Bayes' theorem**, which allows the probability of a class to be estimated using prior knowledge and the probability of observing particular features within that class.

For this project, the two possible classes are:

```text
Recommended
Not Recommended
```

The model then attempts to determine which class is more likely based on the characteristics of a particular Steam review.

The project uses both **continuous** and **categorical** features.

Continuous features include:

- Hours played
- Hours-to-price relationship

Categorical features include:

- Windows support
- macOS support
- Linux support

Gaussian Naive Bayes assumes that continuous values associated with each class can approximately follow a **Gaussian / normal distribution**.

A normal distribution places most values around the centre, with progressively fewer values appearing further away from the mean.

Real-world datasets do not always naturally follow this pattern.

For example, playtime data can be strongly skewed because many users may have relatively low playtime while a much smaller number of players have hundreds or thousands of hours.

The following image helped illustrate the difference between normal and skewed distributions while developing the project:

![Normal and non-normal distributions](https://github.com/cian-collage/oop-machine-learning/assets/124142292/e4a91710-aaa4-48ec-8a5b-eca369a4c759)

Because some of the continuous values in the dataset were heavily skewed, logarithmic transformations were used where required to reduce that skew and make the data more appropriate for the assumptions used by the Gaussian model.

This was one of the more important parts of the project from a learning perspective, as it demonstrated that selecting a machine learning algorithm is not enough on its own — the characteristics and distribution of the input data also matter.

### Gaussian Probability Density Function

For continuous features, the classifier uses the Gaussian probability density function to estimate how likely an observed value is for a particular class.

The probability density function is:

![Gaussian probability density function](https://github.com/cian-collage/oop-machine-learning/assets/124142292/73dcfc4f-40a2-45bf-8201-9ee2421c4f03)

Where:

- **p(x = v | Cₖ)** is the probability density of observing the value `v` given class `Cₖ`
- **μₖ** is the mean of the values associated with class `Cₖ`
- **σ²ₖ** is the variance of the values associated with class `Cₖ`
- **v** is the value being evaluated

For example, the classifier can calculate the likelihood of a particular number of hours played appearing in:

```text
Recommended Reviews
```

and compare it with the likelihood of that same value appearing in:

```text
Not Recommended Reviews
```

The same process is performed for the other continuous values used by the model.

The categorical platform values are handled using the percentage of reviews in each class associated with Windows, macOS, or Linux.

The resulting feature likelihoods are combined with the prior probability of each class.

Conceptually:

```text
Prior Probability
        ×
Feature Likelihoods
        ↓
Posterior Probability
```

The classifier calculates this separately for:

```text
Recommended
```

and:

```text
Not Recommended
```

The class with the higher resulting probability is selected as the model's prediction.

Implementing this process manually was one of the main goals of the project, as it allowed me to understand what a classifier was actually doing rather than treating machine learning as a black-box library call.

---

## Dataset

The project uses a dataset of **Steam game reviews**.

The original dataset was divided into three sections:

| Dataset    |          Rows | Purpose                                             |
| ---------- | ------------: | --------------------------------------------------- |
| Training   |     1,000,000 | Calculate model statistics and train the classifier |
| Validation |       126,346 | Evaluate and refine the model during development    |
| Testing    |       589,329 | Measure the performance of the completed classifier |
| **Total**  | **1,715,675** |                                                     |

The data was preprocessed before use to remove irrelevant information and convert values into a form suitable for the classifier.

The separation between training, validation, and testing data was also an important part of the learning process for this project.

The **training data** is used to calculate the statistics that the classifier relies on.

The **validation data** is used during development to check how well the current version of the model is performing and to help identify problems with the implementation.

The **testing data** is kept separate so that the completed model can be evaluated against data that was not used to calculate its training statistics.

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

Each row of the dataset is converted into an `Instance` object so that all of the information associated with a single review can be passed between the training, validation, testing, and prediction parts of the application.

---

## Validation and Testing

The project separates model development from final testing.

Understanding the distinction between **training, validation, and testing** was one of the main machine learning concepts I wanted to learn through this project.

### Validation

`Validation.java` runs the classifier against the validation dataset and compares:

```text
Predicted Recommendation
          vs
Actual Recommendation
```

The result is reported as an accuracy percentage.

For each review in the validation dataset:

1. The review is passed into the classifier
2. A prediction is generated
3. The prediction is compared with the real recommendation value
4. Correct predictions are counted
5. The final accuracy percentage is calculated

This allowed me to evaluate the model while developing the classifier and identify when changes to the probability calculations improved or reduced its performance.

### Testing

`Tester.java` performs the same comparison using the separate testing dataset.

This allows the final classifier to be evaluated against data that was not used to calculate the training statistics.

The testing dataset is therefore used as the final evaluation of the model after the implementation has been completed.

---

## Model Behaviour and Conclusions

After completing the classifier, I also examined how the trained model responded when its input features were varied systematically.

This was not intended as a separate data-analysis project. The purpose was to test whether the predictor behaved consistently with the relationships it had learned from the training data and to better understand how the features influenced its output.

For the browser portfolio recreation, the model was evaluated across **3,080 controlled input combinations**, using 55 playtime values, seven prices, and all eight Windows / macOS / Linux platform combinations.

### Playtime

**Hours played had the largest effect on the model output among the tested inputs.**

With price fixed at **€20** and Windows selected, the relative recommendation score increased from approximately **3.65% at 1 hour** to a peak of approximately **94.67% at 250 hours**.

At extremely high playtime values the score decreased again, reaching approximately **68.03% at 5,000 hours**.

This supports the behaviour expected from the predictor: greater engagement is generally more consistent with a recommended review, but the classifier does not simply treat additional playtime as indefinitely more positive.

### Price

**Price influenced the prediction, but less strongly than playtime.**

At **50 hours played** with Windows selected, the relative recommendation score ranged from approximately **93.29% at €5** to approximately **85.11% at €100**.

The relationship was not perfectly linear. At **€0.99**, the same input produced approximately **91.72%**, so the predictor does not simply favour the lowest possible price.

Instead, price contributes alongside playtime through the model's hours-to-price relationship.

### Platform Support

**Platform support had a smaller effect on the model output.**

At **50 hours played and €20**, the relative recommendation score increased from approximately **91.93% with Windows only** to approximately **94.75% with Windows, macOS, and Linux support**.

However, every training record includes Windows support. Platform combinations without Windows are therefore not meaningfully represented by the training data and should not be interpreted as reliable real-world predictions.

### Hours Relative to Price

Analysis of the training data also suggested that **hours played relative to price** was associated with recommendation behaviour.

Recommendation rates generally increased as hours per euro increased before beginning to level off.

This supports the use of the hours-to-price feature within the classifier: greater engagement relative to cost was generally more consistent with patterns found among recommended reviews.

This is an observed association in the dataset rather than evidence that increasing playtime or reducing price would cause somebody to recommend a game.

### Overall Interpretation

The model sweep broadly supported the behaviour expected from the features used by the classifier:

- **Playtime had the strongest influence on the model output**
- **Price affected the prediction, but less strongly than playtime**
- **Hours played relative to price helped represent the relationship between engagement and cost**
- **Additional platform support produced a smaller positive effect**
- **The classifier responded to combinations of features rather than relying on one simple rule**

These results reinforced one of the main lessons of the project: evaluating a machine-learning classifier involves more than looking at a single accuracy figure. Inspecting how its predictions change across controlled inputs helps show what the model has actually learned and where limitations in the training data affect its behaviour.

The values discussed above are **relative model scores rather than calibrated probabilities**. They are useful for comparing how the classifier responds to different inputs, but should not be interpreted as literal probabilities that an individual player will recommend a game.

The relationships observed in the model and dataset represent **association rather than causation**.

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

This allows the model to be used interactively rather than only being tested against existing CSV data.

A user can enter information representing a hypothetical Steam review and receive a prediction of whether a similar review would be expected to recommend the game.

### Statistics Display

A second window displays statistics calculated from the training data, including:

- Total number of reviews
- Recommended / not recommended counts
- Recommendation percentages
- Average hours played
- Average price per hour
- Platform distribution for each class

The statistics window was added so that some of the values being calculated internally by the model could also be viewed by the user.

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

`Main.java` acts as the controller connecting the data-loading, machine-learning, testing, and user-interface sections of the project.

### `Stats.java`

Contains the core machine learning implementation.

It:

- Calculates model statistics
- Stores probabilities and statistical values
- Calculates Gaussian likelihoods
- Combines likelihoods with class probabilities
- Predicts whether a review is recommended

The class stores its calculated information using HashMaps for statistics and probabilities.

Values calculated include:

- Total number of reviews
- Recommended and not recommended counts
- Class probabilities
- Mean values
- Standard deviations
- Platform percentages
- Log-transformed continuous statistics

These values are then used by the prediction methods to calculate the likelihood of a new review belonging to either recommendation class.

### `Instance.java`

Represents an individual game review and stores the features used by the classifier.

The purpose of creating a dedicated `Instance` class was to make it easier to keep all information belonging to an individual review together rather than passing separate values throughout the program.

Each instance contains:

- Hours played
- Hours-to-price ratio
- Windows support
- macOS support
- Linux support
- Actual recommendation value

### `Validation.java`

Measures prediction accuracy using the validation dataset.

Each review is passed through the classifier and the prediction is compared against the known result.

The number of correct predictions is used to calculate validation accuracy.

### `Tester.java`

Measures final prediction accuracy using the testing dataset.

It performs a similar process to `Validation.java`, but uses the dedicated testing dataset to evaluate the completed model.

### `GUI.java`

Contains the Java Swing user interface for:

- Entering new game information
- Displaying recommendation predictions
- Viewing statistics calculated from the training data

The GUI provides a simple way of interacting with the completed classifier without needing to manually create new Java objects or edit CSV files.

---

## Technologies

| Area             | Technology                                 |
| ---------------- | ------------------------------------------ |
| Language         | Java                                       |
| Machine Learning | Custom Gaussian Naive Bayes implementation |
| User Interface   | Java Swing                                 |
| Data Format      | CSV                                        |
| Data Structures  | Lists and HashMaps                         |
| Dataset          | Steam game reviews                         |

No external machine learning framework is required for the classifier itself.

This was intentional, as the project was primarily focused on learning how the statistical calculations behind a classifier work rather than learning the API of an existing machine learning framework.

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

The project also helped connect several different areas of programming together:

```text
CSV Dataset
     ↓
Data Processing
     ↓
Java Objects
     ↓
Statistical Analysis
     ↓
Machine Learning Classification
     ↓
Validation and Testing
     ↓
Desktop Interface
```

---

## What I Learned

Because this project was built primarily as a self-learning exercise, the process of understanding the model was just as important as the final prediction accuracy.

Before beginning the project, I had very little experience with machine learning.

Through implementing the classifier, I gained a much better understanding of:

- The difference between training, validation, and testing data
- Why evaluation data should be kept separate from training data
- How probability-based classifiers make decisions
- How prior probabilities influence classification
- How continuous features can be modelled using Gaussian distributions
- How mean, variance, and standard deviation are used by a classifier
- Why the distribution of input data matters
- Why transformations may be required for heavily skewed data
- How multiple feature likelihoods can be combined to produce a final prediction
- How model accuracy can be calculated by comparing predictions with known outcomes

I also improved my understanding of Java and object-oriented programming through:

- Splitting responsibilities across multiple classes
- Using objects to represent rows of data
- Reading and processing CSV files
- Using Lists and HashMaps
- Building a Swing interface
- Separating data processing, model logic, testing, and presentation

Revisiting the completed model also reinforced the importance of inspecting a classifier's behaviour rather than relying only on a single accuracy figure. Testing the predictor across controlled combinations of inputs made it possible to see which features had the greatest influence on its output, whether those effects were consistent with the training data, and where limitations in the dataset restricted what the model could meaningfully predict.

---

## Limitations

This was an introductory machine learning project and has several limitations.

- The classifier uses a relatively small set of hand-selected features
- Model assumptions are simplified
- Feature preprocessing is implemented manually
- Evaluation is based primarily on prediction accuracy
- The Swing interface is intentionally simple
- The project does not use a dedicated ML framework or production data pipeline
- The classifier was built primarily for learning rather than maximising real-world predictive performance
- All records in the training dataset include Windows support, so predictions for non-Windows platform combinations are not well supported by the training data
- The relative model scores produced by the interactive predictor should not be interpreted as calibrated probabilities
- Relationships identified in the dataset and model behaviour represent associations rather than causal effects

These limitations reflect the project's primary goal: understanding the mechanics of a machine learning classifier and implementing those mechanics directly in Java.

---

## Resources

Resources used while learning about Gaussian Naive Bayes, probability, and data distributions included:

- [Normal and Non-Normal Distributions](https://www.slideshare.net/plummer48/normal-and-non-normal-distributions) — reference used while learning about normal and skewed distributions
- [Naive Bayes Classifier - Wikipedia](https://en.wikipedia.org/wiki/Naive_Bayes_classifier#Gaussian_naive_Bayes) — reference material for Gaussian Naive Bayes
- [Gaussian Naive Bayes, Clearly Explained - StatQuest](https://www.youtube.com/watch?v=H3EjCKtlVog) — explanation of Gaussian Naive Bayes and its probability calculations
- [Gaussian Naive Bayes Algorithm - Intellipaat](https://www.youtube.com/watch?v=u5jRUg10bpw) — additional introduction to the algorithm
- [Kaggle Datasets](https://www.kaggle.com/datasets?search=Game) — source used while exploring datasets for the project
