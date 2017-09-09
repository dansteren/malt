import * as fs from 'fs';
import * as readline from 'readline';

// Consider using minimist to help with arg parsing.
// var argv = require('minimist')(process.argv.slice(2));

class Startup {
  public static main(): number {
    const { learningMethod, filePath, evaluationMethod } = this.parseArgs();
    const scanner = readline.createInterface({
      input: fs.createReadStream(filePath)
    });
    scanner.on('line', (line) => {
      console.log('Line from file: ', line);
    })
    return 0;
  }

  /**
   * Processes command line arguments. Exits if args are invalid.
   */
  static parseArgs() {
    const args = process.argv.slice(2);
    let result = {
      learningMethod: '',
      filePath: '',
      evaluationMethod: ''
    }
    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case '-L':
          if (i + 1 !== args.length) {
            result.learningMethod = args[++i];
          } else {
            console.log('missing learning type. Exiting...')
            process.exit();
          }
          break;
        case '-A':
          if (i + 1 !== args.length) {
            result.filePath = args[++i];
            if (!fs.existsSync(result.filePath)) {
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
            result.evaluationMethod = args[++i];
          } else {
            console.log('Evaluation method missing. Exiting...')
            process.exit();
          }
          break;
        default:
          console.log('Invalid option \'' + args[i] + '\'');
          console.log('Usage:');
          console.log('    malt -L [learningAlgorithm] -A [arffFile] -E [evaluationMethod] {[extraParamters]} [OPTIONS]\n');
          process.exit();
      }
    }
    return result;
  }
}

Startup.main();
