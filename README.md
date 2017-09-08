<p align="center">
    <img width="580" src="https://user-images.githubusercontent.com/5455419/30196061-11f572a2-941b-11e7-8291-873bf2c03ce5.png" alt="MALT - a Machine Learning Toolkit"/>
</p>

<p align="center">
  A Machine Learning Toolkit
</p>

---

Typescript port of the [BYU CS 478 machine learning toolkit](http://axon.cs.byu.edu/~martinez/classes/478/stuff/Toolkit.html)

## Usage

In order to use this toolkit, most commands will be similar to those given
on the class website for the Java and C++ toolkits. With the assumption that
you already have dependencies installed, usage is straight-forward.

## Example

Execute the following commands from the root directory of this
repository.

```bash
mkdir datasets
wget http://axon.cs.byu.edu/~martinez/classes/478/stuff/iris.arff -P datasets/
node toolkit.manager -L baseline -A datasets/iris.arff -E training
```

Aside from needing to specify the module to run, commands follow the same
syntax as the other toolkits.

For information on the expected syntax, run

```bash
python -m toolkit.manager --help
```

## Creating Learners

See BaselineLearner.ts and its `BaselineLearner` class for an example of the format of the learner. In particular, new learners will need to override the `train()` and `predict()` functions of the `SupervisedLearner` base class.
