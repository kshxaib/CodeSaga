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
    // C: z.object({
    //   input: z.string().min(1, "Input is required"),
    //   output: z.string().min(1, "Output is required"),
    //   explanation: z.string().optional(),
    // }),
  }),

  codeSnippets: z.object({
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java code snippet is required"),
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    // C: z.string().min(1, "C code snippet is required"),
  }),

  referenceSolutions: z.object({
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    // C: z.string().min(1, "C solution is required"),
  }),

  isPaid: z.boolean().default(false),
  createNewPlaylist: z.boolean().default(false),
  playlistName: z.string().optional(),
  playlistDescription: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0").default(0),
  askedIn: z.array(z.string()).optional(),
});


export const defaultValues = {
    testcases: [{ input: "", output: "" }],
    tags: [""],
    examples: {
      PYTHON: { input: "", output: "", explanation: "" },
      JAVA: { input: "", output: "", explanation: "" },
      JAVASCRIPT: { input: "", output: "", explanation: "" },
      C: { input: "", output: "", explanation: "" },
    },
    codeSnippets: {
      PYTHON: "def solution():\n    # Write your code here\n    pass",
      JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
      C: "#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}",
    },
    referenceSolutions: {
      PYTHON: "# Add your reference solution here",
      JAVA: "// Add your reference solution here",
      JAVASCRIPT: "// Add your reference solution here",
      C: "// Add your reference solution here",
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
  codeSnippets:{
  PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  n = int(sys.stdin.readline().strip())
  sol = Solution()
  print(sol.climbStairs(n))
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
      System.out.println(new Main().climbStairs(n));
  }
}
`,

  JAVASCRIPT: `function climbStairs(n) {
  // Write your code here
}

// Input parsing
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const n = parseInt(line.trim());
  console.log(climbStairs(n));
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
  printf("%d\\n", climbStairs(n));
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
  cout << sol.climbStairs(n) << endl;
  return 0;
}
`,

  CSHARP: `using System;

class Solution {
  public int ClimbStairs(int n) {
    // Write your code here
    return 0;
  }

  static void Main() {
    int n = int.Parse(Console.ReadLine());
    Console.WriteLine(new Solution().ClimbStairs(n));
  }
}
`,

  GO: `package main

import "fmt"

func climbStairs(n int) int {
  // Write your code here
  return 0
}

func main() {
  var n int
  fmt.Scan(&n)
  fmt.Println(climbStairs(n))
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
  println!("{}", climb_stairs(n));
}
`,

  PHP: `<?php

function climbStairs($n) {
  // Write your code here
  return 0;
}

$n = intval(trim(fgets(STDIN)));
echo climbStairs($n) . "\\n";
?>
`,
},

    referenceSolutions: {
    PYTHON: `class Solution:
      def climbStairs(self, n: int) -> int:
          if n <= 2:
              return n
          a, b = 1, 2
          for _ in range(3, n + 1):
              a, b = b, a + b
          return b

  if __name__ == "__main__":
      import sys
      n = int(sys.stdin.readline().strip())
      print(Solution().climbStairs(n))
  `,

  JAVA: `import java.util.Scanner;

class Main {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        System.out.println(new Main().climbStairs(n));
    }
}
`,

  JAVASCRIPT: `function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });

rl.on('line', (line) => {
    const n = parseInt(line.trim());
    console.log(climbStairs(n));
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
    printf("%d\\n", climbStairs(n));
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
    cout << sol.climbStairs(n) << endl;
    return 0;
}
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
        Console.WriteLine(new Solution().ClimbStairs(n));
    }
}
`,

  GO: `package main

import "fmt"

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
    fmt.Println(climbStairs(n))
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
    println!("{}", climb_stairs(n));
}
`,

  PHP: `<?php

function climbStairs($n) {
    if ($n <= 2) return $n;
    $a = 1;
    $b = 2;
    for ($i = 3; $i <= $n; $i++) {
        $temp = $a + $b;
        $a = $b;
        $b = $temp;
    }
    return $b;
}

$n = intval(trim(fgets(STDIN)));
echo climbStairs($n) . "\\n";
?>
`,
}
};


export const sampleStringProblem2 = {
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
  ],
  "examples": {
    "PYTHON": {
      "input": "grid = [[1,3,1],[1,5,1],[4,2,1]]",
      "output": "7",
      "explanation": "Path is 1→3→1→1→1 with sum = 7."
    },
    "JAVA": {
      "input": "grid = {{1,3,1},{1,5,1},{4,2,1}}",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "JAVASCRIPT": {
      "input": "grid = [[1,2,3],[4,5,6]]",
      "output": "12",
      "explanation": "Path is 1→2→3→6 = 12."
    },
    "C": {
      "input": "[[1,3,1],[1,5,1],[4,2,1]]",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "CPP": {
      "input": "{{1,3,1},{1,5,1},{4,2,1}}",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "CSHARP": {
      "input": "new int[][] { new int[] {1,3,1}, new int[] {1,5,1}, new int[] {4,2,1} }",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "GO": {
      "input": "[][]int{{1,3,1},{1,5,1},{4,2,1}}",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "RUST": {
      "input": "vec![vec![1,3,1], vec![1,5,1], vec![4,2,1]]",
      "output": "7",
      "explanation": "Same path as Python example."
    },
    "PHP": {
      "input": "[[1,2,3],[4,5,6]]",
      "output": "12",
      "explanation": "Path is 1→2→3→6 = 12."
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

class Solution {
    public boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        Solution sol = new Solution();
        boolean result = sol.isPalindrome(s);
        System.out.println(result ? "true" : "false");
    }
}
`,

    JAVASCRIPT: `class Solution {
    isPalindrome(s) {
        // Write your code here
        return false;
    }
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const sol = new Solution();
    const result = sol.isPalindrome(line.trim());
    console.log(result ? "true" : "false");
    rl.close();
});

`,

    C: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isPalindrome(char* s) {
    // Write your code here
    return false;
}

int main() {
    char s[200];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "n")] = '\0';
    bool result = isPalindrome(s);
    printf(result ? "true" : "false");
    return 0;
}
`,

    CPP: `#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
        return false;
    }
};

int main() {
    string s;
    getline(cin, s);
    Solution sol;
    bool result = sol.isPalindrome(s);
    cout << (result ? "true" : "false") << endl;
    return 0;
}
`,

    CSHARP: `using System;

class Solution {
    public bool IsPalindrome(string s) {
        // Write your code here
        return false;
    }

    public static void Main() {
        string s = Console.ReadLine();
        Solution sol = new Solution();
        bool result = sol.IsPalindrome(s);
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

type Solution struct{}

func (sol Solution) isPalindrome(s string) bool {
    // Write your code here
    return false
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Scan()
    s := scanner.Text()
    sol := Solution{}
    result := sol.isPalindrome(strings.TrimSpace(s))
    fmt.Println(result)
}

`,

    RUST: `use std::io::{self, Write};

struct Solution;

impl Solution {
    fn is_palindrome(&self, s: &str) -> bool {
        // Write your code here
        false
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let sol = Solution;
    let result = sol.is_palindrome(input.trim());
    println!("{}", if result { "true" } else { "false" });
}
`,

    PHP: `<?php

class Solution {
    public function isPalindrome(string $s): bool {
        // Write your code here
        return false;
    }
}

$handle = fopen("php://stdin", "r");
$s = trim(fgets($handle));
$sol = new Solution();
$result = $sol->isPalindrome($s);
echo $result ? "true" : "false";

?>
`
  },
  referenceSolutions: {
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        s = ''.join(c.lower() for c in s if c.isalnum())
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
C:`#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

bool isPalindrome(char* s) {
    int left = 0;
    int right = strlen(s) - 1;
    
    while (left < right) {
        while (left < right && !isalnum((unsigned char)s[left])) left++;
        while (left < right && !isalnum((unsigned char)s[right])) right--;
        if (tolower((unsigned char)s[left]) != tolower((unsigned char)s[right]))
            return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    char s[200001];
    int i = 0;
    int c;
    
    // Manual input reading without fgets
    while ((c = getchar()) != EOF && c != 10 && i < sizeof(s)-1) {  // 10 is newline
        s[i++] = c;
    }
    s[i] = '\0';
    
    printf(isPalindrome(s) ? "true" : "false");
    return 0;
}`,
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

export const sampleStringProblem = {
  "title": "Serialize and Deserialize Binary Tree",
  "category": "tree",
  "description": "Design an algorithm to serialize and deserialize a binary tree. Your serialize function should convert a tree into a string, and your deserialize function should reconstruct the original tree structure from this string.",
  "difficulty": "HARD",
  "tags": ["Tree", "Depth-First Search", "Breadth-First Search", "Design"],
  "constraints": "The number of nodes in the tree is in the range [0, 10⁴].\n-1000 <= Node.val <= 1000",
  "hints": [
    "Consider using pre-order traversal for serialization",
    "For deserialization, use the same traversal order to reconstruct the tree",
    "Use 'null' or special markers for empty nodes",
    "Consider using a queue or recursive approach for reconstruction"
  ],
  "editorial": "The optimal solution typically uses pre-order traversal with null markers. Serialization converts the tree to a string representation, while deserialization parses this string to reconstruct the original tree. Both operations run in O(n) time and space complexity.",
  "testcases": [
    { "input": "[]", "output": "[]" },
    { "input": "[1]", "output": "[1]" }
  ],
  "askedIn": ["2023", "2022", "2021"],
  "examples": {
    "PYTHON": {
      "input": "root = [1,2,3,null,null,4,5]",
      "output": "[1,2,3,null,null,4,5]",
      "explanation": "The tree is serialized and deserialized correctly maintaining its structure."
    },
    "JAVA": {
      "input": "root = []",
      "output": "[]",
      "explanation": "Empty tree case is handled properly."
    },
    "JAVASCRIPT": {
      "input": "root = [1]",
      "output": "[1]",
      "explanation": "Single node tree is correctly serialized/deserialized."
    },
    "C": {
      "input": "[1,2,3,null,null,4,5]",
      "output": "[1,2,3,null,null,4,5]",
      "explanation": "Same as Python example."
    },
  },
  "codeSnippets": {
    "PYTHON": `# Definition for a binary tree node.
class TreeNode(object):
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string.
        :type root: TreeNode
        :rtype: str
        """
        pass

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        :type data: str
        :rtype: TreeNode
        """
        pass

# Your Codec object will be instantiated and called as such:
# ser = Codec()
# deser = Codec()
# ans = deser.deserialize(ser.serialize(root))

if __name__ == "__main__":
    import sys, json
    from collections import deque
    
    def buildTree(nodes):
        if not nodes:
            return None
        root = TreeNode(nodes[0])
        q = deque([root])
        i = 1
        while q and i < len(nodes):
            curr = q.popleft()
            if nodes[i] is not None:
                curr.left = TreeNode(nodes[i])
                q.append(curr.left)
            i += 1
            if i < len(nodes) and nodes[i] is not None:
                curr.right = TreeNode(nodes[i])
                q.append(curr.right)
            i += 1
        return root
    
    def treeToList(root):
        if not root:
            return []
        q = deque([root])
        res = []
        while q:
            curr = q.popleft()
            if curr:
                res.append(curr.val)
                q.append(curr.left)
                q.append(curr.right)
            else:
                res.append(None)
        while res and res[-1] is None:
            res.pop()
        return res
    
    data = json.loads(sys.stdin.read())
    root = buildTree(data)
    ser = Codec()
    deser = Codec()
    ans = deser.deserialize(ser.serialize(root))
    print(json.dumps(treeToList(ans)))`,

    "JAVA": `import java.util.*;
import com.google.gson.*;

public class Main {
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int x) { val = x; }
    }

    public static class Codec {
        // Encodes a tree to a single string.
        public String serialize(TreeNode root) {
            return "";
        }

        // Decodes your encoded data to tree.
        public TreeNode deserialize(String data) {
            return null;
        }
    }

    public static TreeNode buildTree(Integer[] nodes) {
        if (nodes == null || nodes.length == 0) return null;
        TreeNode root = new TreeNode(nodes[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nodes.length) {
            TreeNode curr = q.poll();
            if (nodes[i] != null) {
                curr.left = new TreeNode(nodes[i]);
                q.add(curr.left);
            }
            i++;
            if (i < nodes.length && nodes[i] != null) {
                curr.right = new TreeNode(nodes[i]);
                q.add(curr.right);
            }
            i++;
        }
        return root;
    }

    public static List<Integer> treeToList(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode curr = q.poll();
            if (curr != null) {
                res.add(curr.val);
                q.add(curr.left);
                q.add(curr.right);
            } else {
                res.add(null);
            }
        }
        while (res.get(res.size() - 1) == null) {
            res.remove(res.size() - 1);
        }
        return res;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.useDelimiter("\\A").next();
        Integer[] data = new Gson().fromJson(input, Integer[].class);
        TreeNode root = buildTree(data);
        Codec ser = new Codec();
        Codec deser = new Codec();
        TreeNode ans = deser.deserialize(ser.serialize(root));
        System.out.println(new Gson().toJson(treeToList(ans)));
    }
}`,

    "JAVASCRIPT": `function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    return '';
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    return null;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */

function buildTree(nodes) {
    if (!nodes || nodes.length === 0) return null;
    const root = new TreeNode(nodes[0]);
    const q = [root];
    let i = 1;
    while (q.length && i < nodes.length) {
        const curr = q.shift();
        if (nodes[i] !== null) {
            curr.left = new TreeNode(nodes[i]);
            q.push(curr.left);
        }
        i++;
        if (i < nodes.length && nodes[i] !== null) {
            curr.right = new TreeNode(nodes[i]);
            q.push(curr.right);
        }
        i++;
    }
    return root;
}

function treeToList(root) {
    const res = [];
    if (!root) return res;
    const q = [root];
    while (q.length) {
        const curr = q.shift();
        if (curr) {
            res.push(curr.val);
            q.push(curr.left);
            q.push(curr.right);
        } else {
            res.push(null);
        }
    }
    while (res[res.length - 1] === null) {
        res.pop();
    }
    return res;
}

const fs = require('fs');
let input = "";
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
    const data = JSON.parse(input);
    const root = buildTree(data);
    const ans = deserialize(serialize(root));
    console.log(JSON.stringify(treeToList(ans)));
});`,

    "C": `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

/** Encodes a tree to a single string. */
char* serialize(struct TreeNode* root) {
    return "";
}

/** Decodes your encoded data to tree. */
struct TreeNode* deserialize(char* data) {
    return NULL;
}

// Note: Input parsing would need to be implemented for actual submission

// Your functions will be called as such:
// char* data = serialize(root);
// deserialize(data);`,
  },
  "referenceSolutions": {
    "PYTHON": `class Codec:
    def serialize(self, root):
        def helper(node):
            if node:
                vals.append(str(node.val))
                helper(node.left)
                helper(node.right)
            else:
                vals.append('#')
        vals = []
        helper(root)
        return ' '.join(vals)

    def deserialize(self, data):
        def helper():
            val = next(vals)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left = helper()
            node.right = helper()
            return node
        vals = iter(data.split())
        return helper()`,

    "JAVA": `public class Codec {
    private static final String SPLITTER = ",";
    private static final String NULL = "null";

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append(NULL).append(SPLITTER);
        } else {
            sb.append(node.val).append(SPLITTER);
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(SPLITTER)));
        return buildTree(nodes);
    }

    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.poll();
        if (val.equals(NULL)) return null;
        TreeNode node = new TreeNode(Integer.valueOf(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}`,

    "JAVASCRIPT": `var serialize = function(root) {
    const res = [];
    const helper = (node) => {
        if (!node) {
            res.push('null');
            return;
        }
        res.push(node.val.toString());
        helper(node.left);
        helper(node.right);
    }
    helper(root);
    return res.join(',');
};

var deserialize = function(data) {
    const nodes = data.split(',');
    const helper = () => {
        const val = nodes.shift();
        if (val === 'null') return null;
        const node = new TreeNode(parseInt(val));
        node.left = helper();
        node.right = helper();
        return node;
    };
    return helper();
};`,

    "C": `char* serialize(struct TreeNode* root) {
    // Implementation would require dynamic string building
    return NULL;
}

struct TreeNode* deserialize(char* data) {
    // Implementation would require parsing the serialized string
    return NULL;
}`,
  }
}