import Head from 'next/head';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Link,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  Center,
  Container,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';

const Home = () => {
  type Result = {
    epoch: number;
    input1: number;
    input2: number;
    target: number;
    weight1: number;
    weight2: number;
    output: number;
    error: number;
    finalWeight1: number;
    finalWeight2: number;
  };

  const [results, setResults] = useState<Result[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      input1: '1100',
      input2: '1010',
      w1: '0.3',
      w2: '-0.1',
      threshold: '0.2',
      learningRate: '0.1',
      operation: 'AND',
    },
    onSubmit: (values) => {
      setErrorMessage('');
        const calculatedResults: Result[] = calculatePerceptron(formik.values);
        setResults(calculatedResults);
        setShowTable(true);
    },

  });

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("input1", event.target.value.toString());
  };

  const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("input2", event.target.value.toString());
  };

  const calculatePerceptron = (values: { input1: any; input2: any; w1: any; w2: any; threshold: any; learningRate: any; operation: string; }) => {
    const { input1, input2, w1, w2, threshold, learningRate, operation } = values;

    let weight1 = parseFloat(w1);
    let weight2 = parseFloat(w2);
    const t = parseFloat(threshold);
    const lr = parseFloat(learningRate);
    const reversedInput1 = String(input1).split('').reverse().join('');
    const reversedInput2 = String(input2).split('').reverse().join('');

    const inputs = [];
    for (let i = 0; i < input1.length; i++) {
      const x1 = parseInt(reversedInput1[i], 10);
      const x2 = parseInt(reversedInput2[i], 10);
      let target;

      switch (operation) {
        case 'AND':
          target = x1 && x2;
          break;
        case 'OR':
          target = x1 || x2;
          break;
        case 'NOT':
          target = +!x1;
          break;
        case 'XOR':
          target = x1 ^ x2;
          break;
        default:
          throw new Error('Invalid operation');
      }

      inputs.push({ x1, x2, target });
    }
    const results: { epoch: number; input1: number; input2: number; target: number; weight1: number; weight2: number; output: number; error: number; finalWeight1: number; finalWeight2: number; }[] = [];

    let epoch = 0;
    let errors = -1;

    while (errors !== 0) {
      errors = 0;
      inputs.forEach((input) => {
        const sum = (weight1 * input.x1) + (weight2 * input.x2);
        const y = sum >= t ? 1 : 0;
        const error = input.target - y;

        if (error !== 0) {
          errors++;
        }

        const finalWeight1 = weight1 + (lr * error * input.x1);
        const finalWeight2 = weight2 + (lr * error * input.x2);

        results.push({
          epoch,
          input1: input.x1,
          input2: input.x2,
          target: input.target,
          weight1,
          weight2,
          output: y,
          error,
          finalWeight1,
          finalWeight2,
        });

        weight1 = finalWeight1;
        weight2 = finalWeight2;
      });

      epoch++;
    }


    return results;
  };

  return (
    <>
      <Head>
        <title>Perceptron Algorithm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" py={10}>
        <Center>
          <Box w="100%" p={5} borderWidth={1} borderRadius="lg">
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} alignItems="stretch">
                <FormControl>
                  <FormLabel>Input 1</FormLabel>
                  <Input type="number" name="input1" onChange={handleInput1Change} value={formik.values.input1} />
                </FormControl>
                <FormControl>
                  <FormLabel>Input 2</FormLabel>
                  <Input type="number" name="input2" onChange={handleInput2Change} value={formik.values.input2} />
                </FormControl>

                <FormControl>
                  <FormLabel>Weight 1 (w1)</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    name="w1"
                    onChange={formik.handleChange}
                    value={formik.values.w1}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Weight 2 (w2)</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    name="w2"
                    onChange={formik.handleChange}
                    value={formik.values.w2}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Threshold</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    name="threshold"
                    onChange={formik.handleChange}
                    value={formik.values.threshold}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Learning Rate</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    name="learningRate"
                    onChange={formik.handleChange}
                    value={formik.values.learningRate}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Operation Type</FormLabel>
                  <Select
                    name="operation"
                    onChange={formik.handleChange}
                    value={formik.values.operation}
                  >
                    <option value="">Select operation</option>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </Select>
                </FormControl>
                <Button type="submit">Submit</Button>
                {errorMessage && (
                  <Box mt={4} color="red.500">
                    {errorMessage}
                  </Box>
                )}

              </VStack>
            </form>
          </Box>
        </Center>

        {showTable && (
          <Box mt={10}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Epoch</Th>
                  <Th>Input 1</Th>
                  <Th>Input 2</Th>
                  <Th>Desired Output</Th>
                  <Th>Initial Weight 1</Th>
                  <Th>Initial Weight 2</Th>
                  <Th>Actual Output</Th>
                  <Th>Error</Th>
                  <Th>Final Weight 1</Th>
                  <Th>Final Weight 2</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results.map((result, index) => (
                  <>
                    <Tr key={index}>
                      <Td>{result.epoch + 1}</Td>
                      <Td>{result.input1}</Td>
                      <Td>{result.input2}</Td>
                      <Td>{result.target}</Td>
                      <Td>{result.weight1.toFixed(2)}</Td>
                      <Td>{result.weight2.toFixed(2)}</Td>
                      <Td>{result.output}</Td>
                      <Td>{result.error}</Td>
                      <Td>{result.finalWeight1.toFixed(2)}</Td>
                      <Td>{result.finalWeight2.toFixed(2)}</Td>
                    </Tr>
                    {index + 1 < results.length && results[index + 1].epoch !== result.epoch && (
                      <Tr>
                        <Td colSpan={10} />
                      </Tr>
                    )}
                  </>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Home;