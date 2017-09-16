import BaselineLearner from './BaselineLearner';
import SupervisedLearner from './SupervisedLearner';
import Matrix from './Matrix';
import { parseArgs } from './argParser';

/**
 *  When you make a new learning algorithm, you should add a line for it to this method.
 */
function getLearner(model: string): SupervisedLearner {
  switch (model) {
    case 'baseline':
      return new BaselineLearner();
    case 'perceptron':
    // return new Perceptron();
    case 'neuralnet':
    // return new NeuralNet();
    case 'decisiontree':
    // return new DecisionTree();
    case 'knn':
    // return new InstanceBasedLearner();
    default:
      throw new Error('Unrecognized model: ' + model);
  }
}

/**
 * The entry point for Malt
 */
function main() {
  //Parse the command line arguments
  const {
    learnerName,
    fileName,
    evalMethod,
    normalize,
    evalParameter,
    verbose
  } = parseArgs();

  // Load the model
  const learner = getLearner(learnerName);

  // Load the ARFF file
  const data = new Matrix();
  data.loadArff(fileName);
  if (normalize) {
    console.log('Using normalized data\n');
    data.normalize();
  }

  // Print some stats
  console.log('');
  console.log('Dataset name: ' + fileName);
  console.log('Number of instances: ' + data.rows());
  console.log('Number of attributes: ' + data.cols());
  console.log('Learning algorithm: ' + learnerName);
  console.log('Evaluation method: ' + evalMethod);
  console.log('');

  switch (evalMethod) {
    case 'training':
      console.log('Calculating accuracy on training set...');
      // Copy all ARFF data except the last column into a new 'features' matrix.
      const features: Matrix = new Matrix(data, 0, 0, data.rows(), data.cols() - 1);
      // Copy the last column in the ARFF data into a labels matrix.
      const labels = new Matrix(data, 0, data.cols() - 1, data.rows(), 1);
      const confusion = new Matrix();
      const startTime = Date.now();
      learner.train(features, labels);
      const elapsedTime = Date.now() - startTime;
      console.log('Time to train (in seconds): ' + elapsedTime / 1000.0);
      const accuracy = learner.measureAccuracy(features, labels, confusion);
      console.log('Training set accuracy: ' + accuracy);
      if (verbose) {
        console.log('\nConfusion matrix: (Row=target value, Col=predicted value)');
        confusion.print();
        console.log('\n');
      }
      break;
    case 'static':

      break;
    case 'random':

      break;
    case 'cross':

      break;
    default:
      throw new Error('The arg parser must have a bug. Please submit a PR');
  }
}

main();
