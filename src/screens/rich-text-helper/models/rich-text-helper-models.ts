export interface RichTextTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
}

export interface RichTextTestInput {
  htmlInput: string;
  markdownInput: string;
  textInput: string;
}

export interface RichTextHelperState {
  testInput: RichTextTestInput;
  testResults: RichTextTestResult[];
  isLoading: boolean;
}

export type ComparisonType = 'html' | 'markdown' | 'sanitize' | 'plain';

export interface RichTextTestCardProps {
  result: RichTextTestResult;
}

export interface RichTextInputFieldProps {
  testInput: RichTextTestInput;
  onInputChange: (updates: Partial<RichTextTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
}

