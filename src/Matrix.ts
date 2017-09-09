import * as fs from 'fs';
import * as readline from 'readline';

export default class Matrix {
  // Data
  private m_data: number[][];

  // Meta-data
  private m_attr_name: string[];
  private m_str_to_enum: Map<string, number >[];
  private m_enum_to_str: Map<number, string >[];

	static MISSING: number = Number.MAX_VALUE; // representation of missing values in the dataset

  // TODO: Figure out how to overload the constructor
	// // Creates a 0x0 matrix. You should call loadARFF or setSize next.
	// constructor() {}

	// Copies the specified portion of that matrix into this matrix
	constructor(that: Matrix, rowStart: number, colStart: number, rowCount: number, colCount: number) {
    this.m_data = [];
    for (let j = 0; j < rowCount; j++) {
      const rowSrc = that.row(rowStart + j) as number[];
      const rowDest: number[] = [];
      for (let i = 0; i < colCount; i++) {
        rowDest[i] = rowSrc[colStart + i];
      }
      this.m_data.push(rowDest);
    }
    this.m_attr_name = [];
    this.m_str_to_enum = [];
    this.m_enum_to_str = [];
    for (let i = 0; i < colCount; i++) {
      this.m_attr_name.push(that.attrName(colStart + i));
      this.m_str_to_enum.push(that.m_str_to_enum[colStart + i]);
      this.m_enum_to_str.push(that.m_enum_to_str[colStart + i]);
    }
  }

  /**
   * Adds a copy of the specified portion of that matrix to this matrix
   */
	add(that: Matrix, rowStart: number, colStart: number, rowCount: number) {
    if (colStart + this.cols() > that.cols()) {
      throw new Error('out of range');
    }
    for (let i = 0; i < this.cols(); i++) {
      if (that.valueCount(colStart + i) !== this.valueCount(i)) {
        throw new Error('incompatible relations');
      }
    }
    for (let j = 0; j < rowCount; j++) {
      const rowSrc: number[] = that.row(rowStart + j);
      const rowDest: number[] = [];
      for (let i = 0; i < this.cols(); i++) {
        rowDest[i] = rowSrc[colStart + i];
      }
      this.m_data.push(rowDest);
    }
  }

  /**
   * Resizes this matrix (and sets all attributes to be continuous)
   * @param rows
   * @param cols
   */
	setSize(rows: number, cols: number) {
    this.m_data = [];
    for (let j = 0; j < rows; j++) {
      const row: number[] = [];
      this.m_data.push(row);
    }
    this.m_attr_name = [];
    this.m_str_to_enum = [];
    this.m_enum_to_str = [];
    for (let i = 0; i < cols; i++) {
      this.m_attr_name.push('');
      this.m_str_to_enum.push(new Map<string, number>());
      this.m_enum_to_str.push(new Map<number, string>());
    }
  }


  /**
   * Loads from an ARFF file
   */
	// public loadArff(filename: string) {
  //   this.m_data = [];
  //   this.m_attr_name = [];
  //   this.m_str_to_enum = [];
  //   this.m_enum_to_str = [];
  //   const READDATA = false;
  //   // TODO: Figure out how `Scanner` works.
  //   const scanner = readline.createInterface({
  //     input: fs.createReadStream(filename)
  //   });
  //   scanner.on('line', (line) => {
  //     if (line.length() > 0 && line.charAt(0) !== '%') {
  //       if (!READDATA) {
  //         // TODO: Unanalyzed passed this point.
  //         Scanner t = new Scanner(line);
  //         String firstToken = t.next().toUpperCase();

  //         if (firstToken.equals("@RELATION")) {
  //           String datasetName = t.nextLine();
  //         }

  //         if (firstToken.equals("@ATTRIBUTE")) {
  //           TreeMap < String, Integer > ste = new TreeMap<String, Integer>();
  //           m_str_to_enum.add(ste);
  //           TreeMap < Integer, String > ets = new TreeMap<Integer, String>();
  //           m_enum_to_str.add(ets);

  //           Scanner u = new Scanner(line);
  //           if (line.indexOf("'") !== -1) u.useDelimiter("'");
  //           u.next();
  //           String attributeName = u.next();
  //           if (line.indexOf("'") !== -1) attributeName = "'" + attributeName + "'";
  //           m_attr_name.add(attributeName);

  //           int vals = 0;
  //           String type = u.next().trim().toUpperCase();
  //           if (type.equals("REAL") || type.equals("CONTINUOUS") || type.equals("INTEGER")) {
  //           }
  //           else {
  //             try {
  //               String values = line.substring(line.indexOf("{") + 1, line.indexOf("}"));
  //               Scanner v = new Scanner(values);
  //               v.useDelimiter(",");
  //               while (v.hasNext()) {
  //                 String value = v.next().trim();
  //                 if (value.length() > 0) {
  //                   ste.put(value, new Integer(vals));
  //                   ets.put(new Integer(vals), value);
  //                   vals++;
  //                 }
  //               }
  //             }
  //             catch (Exception e) {
  //               throw new Exception("Error parsing line: " + line + "\n" + e.toString());
  //             }
  //           }
  //         }
  //         if (firstToken.equals("@DATA")) {
  //           READDATA = true;
  //         }
  //       }
  //       else {
  //         double[] newrow = new double[cols()];
  //         int curPos = 0;

  //         try {
  //           Scanner t = new Scanner(line);
  //           t.useDelimiter(",");
  //           while (t.hasNext()) {
  //             String textValue = t.next().trim();
  //             //console.log(textValu\ne);

  //             if (textValue.length() > 0) {
  //               double doubleValue;
  //               int vals = m_enum_to_str.get(curPos).size();

  //               //Missing instances appear in the dataset as a double defined as MISSING
  //               if (textValue.equals("?")) {
  //                 doubleValue = MISSING;
  //               }
  //               // Continuous values appear in the instance vector as they are
  //               else if (vals === 0) {
  //                 doubleValue = Double.parseDouble(textValue);
  //               }
  //               // Discrete values appear as an index to the "name"
  //               // of that value in the "attributeValue" structure
  //               else {
  //                 doubleValue = m_str_to_enum.get(curPos).get(textValue);
  //                 if (doubleValue === -1) {
  //                   throw new Exception("Error parsing the value '" + textValue + "' on line: " + line);
  //                 }
  //               }

  //               newrow[curPos] = doubleValue;
  //               curPos++;
  //             }
  //           }
  //         }
  //         catch (Exception e) {
  //           throw new Exception("Error parsing line: " + line + "\n" + e.toString());
  //         }
  //         m_data.add(newrow);
  //       }
  //     }
  //   });
  // }

  /** Returns the number of rows in the matrix */
  rows() {
    return this.m_data.length;
  }

  /** Returns the number of columns (or attributes) in the matrix */
  cols() {
    return this.m_attr_name.length;
  }

  /** Returns the specified row */
  row(r: number) {
    return this.m_data[r];
  }

  /** Returns the element at the specified row and column */
  get(r: number, c: number) {
    return this.m_data[r][c];
  }

  /** Sets the value at the specified row and column */
  set(r: number, c: number, v: number) {
    this.row(r)[c] = v; //TODO: Is this ok in javascript?
  }

  /** Returns the name of the specified attribute */
  attrName(col: number) {
    return this.m_attr_name[col];
  }

  /** Set the name of the specified attribute */
  setAttrName(col: number, name: string) {
    this.m_attr_name[col] = name;
  }

  /** Returns the name of the specified value */
  attrValue(attr: number, val: number) {
    return this.m_enum_to_str[attr][val] as string;
  }

  /**
   * Returns the number of values associated with the specified attribute (or column)
   * 0=continuous, 2=binary, 3=trinary, etc.
  */
  valueCount(col: number) {
    return this.m_enum_to_str[col].size;
  }

  /**
   * Shuffles the row order with a buddy matrix.
   * Differs from java toolkit because it doesn't accept the java `Random`
   * construct as the first parameter.
   */
  shuffle(buddy?: Matrix) {
    for (let n = this.rows(); n > 0; n--) {
      const i = Math.floor(Math.random() * n);
      const tmp = this.row(n - 1);
      this.m_data[n - 1] = this.row(i);
      this.m_data[i] = tmp;
      if (buddy) {
        const tmp1 = buddy.row(n - 1);
        buddy.m_data[n - 1] = buddy.row(i);
        buddy.m_data[i] = tmp1;
      }
    }
  }

  /** Returns the mean of the specified column */
  columnMean(col: number) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col);
      if (v !== Matrix.MISSING) {
        sum += v;
        count++;
      }
    }
    return sum / count;
  }

  /** Returns the min value in the specified column */
  columnMin(col: number): number {
    let m = Matrix.MISSING;
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col);
      if (v !== Matrix.MISSING) {
        if (m === Matrix.MISSING || v < m)
          m = v;
      }
    }
    return m;
  }

  /** Returns the max value in the specified column */
  columnMax(col: number) {
    let m = Matrix.MISSING;
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col);
      if (v !== Matrix.MISSING) {
        if (m === Matrix.MISSING || v > m)
          m = v;
      }
    }
    return m;
  }

  /** Returns the most common value in the specified column */
  mostCommonValue(col: number) {
    const tm = new Map<number, number>();
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col);
      if (v !== Matrix.MISSING) {
        const count: number = tm.get(v);
        if (count === null)
          tm.set(v, 1);
        else
          tm.set(v, count + 1);
      }
    }
    let maxCount = 0;
    let val = Matrix.MISSING;
    // TODO: Make sure this iterator stuff is correct
    tm.forEach((value: number, key: number, map: Map<number, number>) => {
      if (value > maxCount) {
        maxCount = value;
        val = key;
      }
    });
    return val;
  }

  normalize() {
    for (let i = 0; i < this.cols(); i++) {
      if (this.valueCount(i) === 0) {
        const min = this.columnMin(i);
        const max = this.columnMax(i);
        for (let j = 0; j < this.rows(); j++) {
          const v = this.get(j, i);
          if (v !== Matrix.MISSING) {
            this.set(j, i, (v - min) / (max - min));
          }
        }
      }
    }
  }

  print() {
    console.log('@RELATION Untitled\n');
    for (let i = 0; i < this.m_attr_name.length; i++) {
      console.log('@ATTRIBUTE ' + this.m_attr_name[i]);
      const vals = this.valueCount(i);
      if (vals === 0) {
        console.log(' CONTINUOUS\n');
      }
      else {
        console.log(' {');
        for (let j = 0; j < vals; j++) {
          if (j > 0) {
            console.log(', ');
          }
          console.log(this.m_enum_to_str[i].get(j));
        }
        console.log('}\n');
      }
    }
    console.log('@DATA\n');
    for (let i = 0; i < this.rows(); i++) {
      const r = this.row(i);
      for (let j = 0; j < r.length; j++) {
        if (j > 0) {
          console.log(', ');
        }
        if (this.valueCount(j) === 0) {
          console.log(r[j]);
        }
        else {
          console.log(this.m_enum_to_str[j].get(r[j]));
        }
      }
      console.log('\n');
    }
  }
}
