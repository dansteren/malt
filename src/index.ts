import * as fs from 'fs';
import * as readline from 'readline';
import BaselineLearner from './BaselineLearner';
import SupervisedLearner from './SupervisedLearner';
import Matrix from './Matrix';

// Consider using a commandline parser to parse args
// Either minimist: https://www.npmjs.com/package/minimist
// or commander: https://www.npmjs.com/package/commander

/**
 * Processes command line arguments. Exits if args are invalid.
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let result = {
    learnerName: '',
    fileName: '',
    evalMethod: ''
  }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-L':
        if (i + 1 !== args.length) {
          result.learnerName = args[++i];
        } else {
          console.log('missing learning type. Exiting...')
          process.exit();
        }
        break;
      case '-A':
        if (i + 1 !== args.length) {
          result.fileName = args[++i];
          if (!fs.existsSync(result.fileName)) {
            console.log('arff file does not exist. Exiting...')
            process.exit();
          }
        } else {
          console.log('missing arff file. Exiting...')
          process.exit();
        }
        break;
      case '-E':
        if (i + 1 !== args.length) {
          result.evalMethod = args[++i];
        } else {
          console.log('Evaluation method missing. Exiting...')
          process.exit();
        }
        break;
      default:
        console.log('Invalid option \'' + args[i] + '\'');
        console.log('Usage:');
        console.log('    malt -L [learningAlgorithm] -A [arffFile] -E [evalMethod] {[extraParamters]} [OPTIONS]\n');
        process.exit();
    }
  }
  return result;
}

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
      throw new Error("Unrecognized model: " + model);
  }
}

/**
 * The entry point for Malt
 */
function main() {
  const { learnerName, fileName, evalMethod } = parseArgs();
  const normalize = false; // TODO get this from the args

  const learner = getLearner(learnerName);

  const data = new Matrix();
  data.loadArff(fileName);
  if (normalize) {
    console.log('Using normalized data\n');
    data.normalize();
  }

  // Print some stats
  console.log();
  console.log("Dataset name: " + fileName);
  console.log("Number of instances: " + data.rows());
  console.log("Number of attributes: " + data.cols());
  console.log("Learning algorithm: " + learnerName);
  console.log("Evaluation method: " + evalMethod);
  console.log();

  console.log('ran program');
}

main();
