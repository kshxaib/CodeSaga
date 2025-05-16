import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    C: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    TYPESCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CSHARP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    GO: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    RUST: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PHP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java code snippet is required"),
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    C: z.string().min(1, "C code snippet is required"),
    CPP: z.string().min(1, "CPP code snippet is required"),
    TYPESCRIPT: z.string().min(1, "TypeScript code snippet is required"),
    CSHARP: z.string().min(1, "CSHARP code snippet is required"),
    GO: z.string().min(1, "Go code snippet is required"),
    RUST: z.string().min(1, "Rust code snippet is required"),
    PHP: z.string().min(1, "PHP code snippet is required"),
  }),
  referenceSolutions: z.object({
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    C: z.string().min(1, "C solution is required"),
    CPP: z.string().min(1, "CPP solution is required"),
    TYPESCRIPT: z.string().min(1, "TypeScript solution is required"),
    CSHARP: z.string().min(1, "CSHARP solution is required"),
    GO: z.string().min(1, "Go solution is required"),
    RUST: z.string().min(1, "Rust solution is required"),
    PHP: z.string().min(1, "PHP solution is required"),
  }),
});


export const defaultValues = {
    testcases: [{ input: "", output: "" }],
    tags: [""],
    examples: {
      PYTHON: { input: "", output: "", explanation: "" },
      JAVA: { input: "", output: "", explanation: "" },
      JAVASCRIPT: { input: "", output: "", explanation: "" },
      C: { input: "", output: "", explanation: "" },
      CPP: { input: "", output: "", explanation: "" },
      TYPESCRIPT: { input: "", output: "", explanation: "" },
      CSHARP: { input: "", output: "", explanation: "" },
      GO: { input: "", output: "", explanation: "" },
      RUST: { input: "", output: "", explanation: "" },
      PHP: { input: "", output: "", explanation: "" },
    },
    codeSnippets: {
      PYTHON: "def solution():\n    # Write your code here\n    pass",
      JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
      C: "#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      CPP: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      TYPESCRIPT: "function solution(): void {\n  // Write your code here\n}",
      CSHARP: "using System;\n\nclass Program {\n    static void Main() {\n        // Write your code here\n    }\n}",
      GO: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Write your code here\n    fmt.Println(\"Hello\")\n}",
      RUST: "fn main() {\n    // Write your code here\n    println!(\"Hello, world!\");\n}",
      PHP: "<?php\n// Write your code here\n?>",
    },
    referenceSolutions: {
      PYTHON: "# Add your reference solution here",
      JAVA: "// Add your reference solution here",
      JAVASCRIPT: "// Add your reference solution here",
      C: "// Add your reference solution here",
      CPP: "// Add your reference solution here",
      TYPESCRIPT: "// Add your reference solution here",
      CSHARP: "// Add your reference solution here",
      GO: "// Add your reference solution here",
      RUST: "// Add your reference solution here",
      PHP: "// Add your reference solution here",
    },
}

// Sample problem data for pre-filling the form
export const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", 
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints: "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial: "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    { input: "2", output: "2" },
    { input: "3", output: "3" },
    { input: "4", output: "5" }
  ],
  examples: {
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation: "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation: "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps"
    },
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps"
    },
    C: {
      input: "n = 5",
      output: "8",
      explanation: "There are eight ways to climb 5 steps following the 1 or 2 steps at a time rule."
    },
    CPP: {
      input: "n = 4",
      output: "5",
      explanation: "There are five ways to climb to the top (same as Java example)."
    },
    TYPESCRIPT: {
      input: "n = 3",
      output: "3",
      explanation: "Same as JavaScript example but with TypeScript type annotations."
    },
    CSHARP: {
      input: "n = 4",
      output: "5",
      explanation: "Same as Java example but with CSHARP syntax."
    },
    GO: {
      input: "n = 5",
      output: "8",
      explanation: "Same as C example but with Go syntax."
    },
    RUST: {
      input: "n = 4",
      output: "5",
      explanation: "Same as Java example but with Rust syntax."
    },
    PHP: {
      input: "n = 3",
      output: "3",
      explanation: "Same as JavaScript example but with PHP syntax."
    }
  },
  codeSnippets: {
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys

  # Parse input
  n = int(sys.stdin.readline().strip())

  # Solve
  sol = Solution()
  result = sol.climbStairs(n)

  # Print result
  print(result)
`,

    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }

  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());

      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);

      System.out.println(result);
      scanner.close();
  }
}
`,

    JAVASCRIPT: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const n = parseInt(line.trim());
  const result = climbStairs(n);
  console.log(result);
  rl.close();
});
`,

    C: `#include <stdio.h>

int climbStairs(int n) {
  // Write your code here
  return 0;
}

int main() {
  int n;
  scanf("%d", &n);
  int result = climbStairs(n);
  printf("%d\n", result);
  return 0;
}
`,

    CPP: `#include <iostream>
using namespace std;

class Solution {
public:
  int climbStairs(int n) {
    // Write your code here
    return 0;
  }
};

int main() {
  int n;
  cin >> n;
  Solution sol;
  int result = sol.climbStairs(n);
  cout << result << endl;
  return 0;
}
`,

    TYPESCRIPT: `function climbStairs(n: number): number {
  // Write your code here
  return 0;
}

// Input handling
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line: string) => {
  const n = parseInt(line.trim());
  const result = climbStairs(n);
  console.log(result);
  rl.close();
});
`,

    CSHARP: `using System;

class Solution {
  public int ClimbStairs(int n) {
    // Write your code here
    return 0;
  }

  static void Main() {
    int n = int.Parse(Console.ReadLine());
    Solution sol = new Solution();
    int result = sol.ClimbStairs(n);
    Console.WriteLine(result);
  }
}
`,

    GO: `package main

import (
  "fmt"
)

func climbStairs(n int) int {
  // Write your code here
  return 0
}

func main() {
  var n int
  fmt.Scan(&n)
  result := climbStairs(n)
  fmt.Println(result)
}
`,

    RUST: `use std::io;

fn climb_stairs(n: i32) -> i32 {
  // Write your code here
  0
}

fn main() {
  let mut input = String::new();
  io::stdin().read_line(&mut input).unwrap();
  let n: i32 = input.trim().parse().unwrap();
  let result = climb_stairs(n);
  println!("{}", result);
}
`,

    PHP: `<?php

function climbStairs($n) {
  // Write your code here
  return 0;
}

$n = intval(trim(fgets(STDIN)));
$result = climbStairs($n);
echo $result . "\n";
?>
`
  },
  referenceSolutions: {
    PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n+1):
            a, b = b, a + b
        return b
        
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  sol = Solution()
  result = sol.climbStairs(n)
  
  print(result)`,

    JAVA:  `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,

    JAVASCRIPT: `function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// Input parsing
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const n = parseInt(line.trim());
    const result = climbStairs(n);
    console.log(result);
    rl.close();
});
`,

    C: `#include <stdio.h>

int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

int main() {
    int n;
    scanf("%d", &n);
    int result = climbStairs(n);
    printf("%d\n", result);
    return 0;
}
`,

    CPP: `#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
};

int main() {
    int n;
    cin >> n;
    Solution sol;
    int result = sol.climbStairs(n);
    cout << result << endl;
    return 0;
}
`,

    TYPESCRIPT: `function climbStairs(n: number): number {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// Input/output handling
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line: string) => {
    const n = parseInt(line.trim());
    const result = climbStairs(n);
    console.log(result);
    rl.close();
});
`,

    CSHARP: `using System;

public class Solution {
    public int ClimbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void Main() {
        int n = int.Parse(Console.ReadLine());
        Solution sol = new Solution();
        int result = sol.ClimbStairs(n);
        Console.WriteLine(result);
    }
}
`,

    GO: `package main

import (
    "fmt"
)

func climbStairs(n int) int {
    if n <= 2 {
        return n
    }
    a, b := 1, 2
    for i := 3; i <= n; i++ {
        a, b = b, a + b
    }
    return b
}

func main() {
    var n int
    fmt.Scan(&n)
    result := climbStairs(n)
    fmt.Println(result)
}
`,

    RUST: `use std::io;

fn climb_stairs(n: i32) -> i32 {
    if n <= 2 {
        return n;
    }
    let (mut a, mut b) = (1, 2);
    for _ in 3..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    b
}

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let n: i32 = input.trim().parse().unwrap();
    let result = climb_stairs(n);
    println!("{}", result);
}
`,

    PHP: `<?php

function climbStairs($n) {
    if ($n <= 2) return $n;
    $a = 1; $b = 2;
    for ($i = 3; $i <= $n; $i++) {
        $temp = $a + $b;
        $a = $b;
        $b = $temp;
    }
    return $b;
}

$n = intval(trim(fgets(STDIN)));
$result = climbStairs($n);
echo $result . "\n";
?>
`}
};

// Sample problem data for another type of question
export const sampleStringProblem = {
  title: "Valid Palindrome",
  description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints: "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints: "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial: "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    { input: "A man, a plan, a canal: Panama", output: "true" },
    { input: "race a car", output: "false" },
    { input: " ", output: "true" }
  ],
  examples: {
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.'
    },
    JAVA: {
      input: 's = "race a car"',
      output: "false",
      explanation: '"raceacar" is not a palindrome.'
    },
    JAVASCRIPT: {
      input: 's = " "',
      output: "true",
      explanation: 'Empty string after processing is a palindrome.'
    },
    C: {
      input: 's = "No lemon, no melon"',
      output: "true",
      explanation: '"nolemonnomelon" is a palindrome.'
    },
    CPP: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: 'Same as Python example.'
    },
    TYPESCRIPT: {
      input: 's = "Was it a car or a cat I saw?"',
      output: "true",
      explanation: '"wasitacaroracatisaw" is a palindrome.'
    },
    CSHARP: {
      input: 's = "RaceCar"',
      output: "true",
      explanation: '"racecar" is a palindrome.'
    },
    GO: {
      input: 's = "0P"',
      output: "false",
      explanation: '"0p" is not a palindrome.'
    },
    RUST: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: 'Same as Python example.'
    },
    PHP: {
      input: 's = "ab_a"',
      output: "true",
      explanation: '"aba" is a palindrome.'
    }
  },
  codeSnippets: {
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())`,

    JAVA: `import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,

    JAVASCRIPT: `function isPalindrome(s) {
    return s === s.split('').reverse().join('');
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const result = isPalindrome(line.trim());
    console.log(result ? "true" : "false");
    rl.close();
});
`,

    C: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isPalindrome(char* s) {
    int len = strlen(s);
    for (int i = 0; i < len / 2; i++) {
        if (s[i] != s[len - i - 1]) {
            return false;
        }
    }
    return true;
}

int main() {
    char s[200];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "\n")] = '\0';  // Remove newline character
    bool result = isPalindrome(s);
    printf(result ? "true\n" : "false\n");
    return 0;
}
`,

    CPP: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(const string& s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s[i] != s[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);
    bool result = isPalindrome(s);
    cout << (result ? "true" : "false") << endl;
    return 0;
}
`,

    TYPESCRIPT: `function isPalindrome(s: string): boolean {
    return s === s.split('').reverse().join('');
}

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line: string) => {
    const result = isPalindrome(line.trim());
    console.log(result ? "true" : "false");
    rl.close();
});
`,

    CSHARP: `using System;

class Solution {
    public static bool IsPalindrome(string s) {
        int i = 0, j = s.Length - 1;
        while (i < j) {
            if (s[i] != s[j]) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }

    static void Main() {
        string input = Console.ReadLine();
        bool result = IsPalindrome(input);
        Console.WriteLine(result ? "true" : "false");
    }
}
`,

    GO: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func isPalindrome(s string) bool {
    s = strings.TrimSpace(s)
    for i := 0; i < len(s)/2; i++ {
        if s[i] != s[len(s)-i-1] {
            return false
        }
    }
    return true
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Scan()
    input := scanner.Text()
    result := isPalindrome(input)
    fmt.Println(result)
}
`,

    RUST: `use std::io::{self, Write};

fn is_palindrome(s: &str) -> bool {
    let s = s.trim();
    let len = s.len();
    for i in 0..len / 2 {
        if s.as_bytes()[i] != s.as_bytes()[len - i - 1] {
            return false;
        }
    }
    true
}

fn main() {
    let mut input = String::new();
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut input).unwrap();
    let result = is_palindrome(&input);
    println!("{}", if result { "true" } else { "false" });
}
`,

    PHP: `<?php

function isPalindrome($s) {
    $s = trim($s);
    return $s === strrev($s);
}

$s = rtrim(fgets(STDIN));
$result = isPalindrome($s);
echo $result ? "true" : "false";

?>
`
  },
  referenceSolutions: {
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        s = [c.lower() for c in s if c.isalnum()]
        return s == s[::-1]

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())
`,

    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,

   JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,

    C: `#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

bool isPalindrome(char* s) {
    int left = 0, right = strlen(s) - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left++]) != tolower(s[right--])) return false;
    }
    return true;
}

int main() {
    char s[200001];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "\n")] = '\0';  // remove newline
    printf(isPalindrome(s) ? "true\n" : "false\n");
    return 0;
}
`,

    CPP: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left++]) != tolower(s[right--])) return false;
        }
        return true;
    }
};

int main() {
    string s;
    getline(cin, s);
    Solution sol;
    cout << (sol.isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
`,

    TYPESCRIPT: `function isPalindrome(s: string): boolean {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left++] !== s[right--]) return false;
    }
    return true;
}

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line: string) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
});
`,

    CSHARP: `using System;
using System.Text.RegularExpressions;

public class Solution {
    public static bool IsPalindrome(string s) {
        s = Regex.Replace(s, "[^a-zA-Z0-9]", "").ToLower();
        int left = 0, right = s.Length - 1;
        while (left < right) {
            if (s[left++] != s[right--]) return false;
        }
        return true;
    }

    public static void Main() {
        string input = Console.ReadLine();
        bool result = IsPalindrome(input);
        Console.WriteLine(result ? "true" : "false");
    }
}
`,

    GO: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
    "unicode"
)

func isPalindrome(s string) bool {
    s = strings.Map(func(r rune) rune {
        if unicode.IsLetter(r) || unicode.IsNumber(r) {
            return unicode.ToLower(r)
        }
        return -1
    }, s)

    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Scan()
    input := scanner.Text()
    fmt.Println(isPalindrome(input))
}
`,

    RUST: `use std::io::{self, BufRead};

fn is_palindrome(s: String) -> bool {
    let s: Vec<char> = s.chars()
        .filter(|c| c.is_ascii_alphanumeric())
        .map(|c| c.to_ascii_lowercase())
        .collect();
    let mut left = 0;
    let mut right = s.len().saturating_sub(1);
    while left < right {
        if s[left] != s[right] {
            return false;
        }
        left += 1;
        right -= 1;
    }
    true
}

fn main() {
    let stdin = io::stdin();
    let s = stdin.lock().lines().next().unwrap().unwrap();
    let result = is_palindrome(s);
    println!("{}", if result { "true" } else { "false" });
}
`,

    PHP: `<?php

function isPalindrome($s) {
    $s = preg_replace('/[^a-z0-9]/i', '', strtolower($s));
    return $s === strrev($s);
}

$s = trim(fgets(STDIN));
$result = isPalindrome($s);
echo $result ? "true\n" : "false\n";
?>
`
  }
};