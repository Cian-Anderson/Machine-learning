# Steam Game Recommendation Predictor — Portfolio Demo

`Demo/` is an additive, browser-based portfolio presentation for the existing Steam Game Recommendation Predictor project. It is **not** the original implementation. The original classifier was written in Java, implemented Gaussian Naive Bayes manually, and was presented through a Swing interface. This static React/TypeScript application recreates only the interactive prediction stage.

The original project was an educational, self-learning exercise focused on probability, data preparation, and implementing a classifier without an ML framework. This demo is not a production recommendation engine and does not claim to predict whether a game is objectively good.

## Data and model

The source CSVs are deliberately not bundled with this demo. The browser loads only `public/model/model.json`, a small export of the statistics calculated from `Training.csv`; it does not need the validation or testing CSVs at runtime. Model-generation code reads the CSVs as streams rather than keeping the full dataset in memory.

The raw files are expected in the project root beside `Demo/`:

```text
Training.csv
Validation.csv
Testing.csv
```

From the `Demo/` directory, regenerate the model and historical evaluation values with:

```sh
npm run generate:model
```

Alternatively, provide explicit paths (relative paths resolve from the current directory):

```sh
node scripts/generate-model.mjs --training ../Training.csv --validation ../Validation.csv --testing ../Testing.csv
```

The script writes `public/model/model.json` and `public/model/evaluation.json`. If validation or testing files are missing, model generation still completes, and the corresponding evaluation is marked unavailable. These JSON files contain model statistics and aggregate evaluation results, not review rows.

## Run and build

From this directory:

```sh
npm install
npm run generate:model
npm run dev
```

Use Node.js 20.19+ or 22.12+ for the Vite toolchain.

Create and preview the static site with:

```sh
npm run build
npm run preview
```

Vite writes the deployable site to `Demo/dist/`. The Vite base path is relative (`./`) so assets work when the folder is deployed below a nested portfolio route or embedded in an iframe. The app uses no backend or Java runtime.

## Correction to the original Java calculation

The browser demo uses a corrected Gaussian Naive Bayes calculation rather than reproducing several incompatible calculations in the original `Stats.java` and Swing input handler. The original Swing code applied repeated logarithms to hours, while its training means and standard deviations were calculated from different (raw) feature scales. The original likelihood code also reused recommended-class statistics when scoring the not-recommended class, and its platform percentages were divided by the total dataset count rather than by the count for that class. Together, these issues made the output largely reflect the Windows checkbox instead of the entered hours and price.

The corrected demo consistently calculates `log(hours)` and `log(hours / price)` for training, evaluation, and browser inputs. It calculates means and population standard deviations from those same transformed features, and calculates each platform's frequency within its own recommendation class. The classifier selects the greater log-posterior score; normalized display values are labelled **relative model score**, not probability.

`evaluation.json` reports accuracy for both the corrected demo model and the original Java behavior on the same validation/testing splits. This makes the change visible rather than implying that the browser demo exactly duplicates the submitted Java classifier. The original Java source remains unchanged.

## Dataset

| Split | Rows | Approximate size |
| --- | ---: | ---: |
| Training | 1,000,000 | 64.72 MB |
| Validation | 126,346 | 8.18 MB |
| Testing | 589,329 | 38.06 MB |
| **Total** | **1,715,675** | **110.96 MB** |

The raw dataset is not bundled with this portfolio demo. The demo uses the trained statistical parameters generated from the original training data.

The page also shows the CSV column names and first three records from the local `Training.csv`. On narrow screens the wide table can be scrolled horizontally.

The original README's dataset link is [Download / View the Dataset](https://drive.google.com/drive/folders/1enufBe_7Sh8CKnDgMJ1v9yDIrT3nkxWt?usp=sharing).
