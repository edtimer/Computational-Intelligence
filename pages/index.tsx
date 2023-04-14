import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'




import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useFormik } from 'formik';



const confetti = {
  light: {
    primary: '4299E1',
    secondary: 'BEE3F8',
  },

  dark: {
    primary: '1A365D',
    secondary: '2A4365',
  },
};


export default function Home() {
  const handleCalculation = () => {










  }
  interface DataReceived {
    weight1: number
    weight2: number
    input1: number
    input2: number
    output: number

  }
  const [weightOne, setWeightOne] = useState(0.0)
  const [weightTwo, setWeightTwo] = useState(0.0)
  const [operation, setOperation] = useState('AND')
  const [input1, setInput1] = useState(1)
  const [input2, setInput2] = useState(0)
  const [threshhold, setThreshhold] = useState(0.0)
  const [learningRate, setLearningRate] = useState(0.0)
  const [showTable, setShowTable] = useState(false)
  const [result, setResult] = useState<DataReceived[]>([])
  const calculation = (values: any) => {



    const allPatterns = []

    console.log("all received values", values)
    var newWeight1 = values.w1;
    var newWeight2 = values.w2;
    var output;
    var expectedOutput;
    var expectedOutputArray;
    const learningRate = values.learningRate;
    var inputInNumberFormat1 = parseInt(values.input1, 2);
    var inputInNumberFormat2 = parseInt(values.input2, 2);
    const input1 = '' + values.input1;
    const input2 = '' + values.input2;
    const input1Array = Array.from(String(input1), Number);
    const input2Array = Array.from(String(input2), Number);
    const lengthInput1 = input1Array.length
    const lengthInput2 = input2Array.length
    console.log("values pure", values)
    console.log("array length", lengthInput1, lengthInput2)
    console.log("arrays", input1Array, input2Array)
    console.log("converted", inputInNumberFormat1, inputInNumberFormat2)


    if (values.operation === 'AND') {
      expectedOutput = (inputInNumberFormat1 & inputInNumberFormat2).toString(2)
      console.log("AND operation", expectedOutput)
      expectedOutputArray = Array.from(String(expectedOutput), Number)
    }
    else if (values.oepration === 'OR') {
      expectedOutput = (inputInNumberFormat1 | inputInNumberFormat2).toString(2)
      console.log("OR operation", expectedOutput)
      expectedOutputArray = Array.from(String(expectedOutput), Number)
      // console.log("expected array", expectedOutput)
    }
    else {
      expectedOutput = (inputInNumberFormat1 & inputInNumberFormat2).toString(2)
      expectedOutputArray = Array.from(String(expectedOutput), Number)
      console.log("NOT operation", expectedOutput)
    }

    // console.log("all input element1,element2,w1,w2", input1Array.slice(-1)[0], input2Array.slice(-1)[0], values.w1, values.w2)
    setWeightOne(values.w1)
    setWeightTwo(values.w2)
    for (let i = 0; i < lengthInput1; i++) {

      const arr1ReveresedElement = input1Array.slice().reverse()[i]
      const expectedOutputReveresedArray = expectedOutputArray.slice().reverse()[i]
      const arr2RevereseElement = input2Array.slice().reverse()[i]
      const pattern = (arr1ReveresedElement * newWeight1) + (arr2RevereseElement * newWeight2)
      console.log(`patter${i} `, arr1ReveresedElement, '*', newWeight1, " + ", arr2RevereseElement, '*', newWeight2, " = ", pattern)


      if (pattern > values.threshold) {
        console.log("larger than threshold")
        output = 1

      }
      else {
        output = 0


      }
      console.log("comparing ", expectedOutputReveresedArray, "the output: ", output)
      if (expectedOutputReveresedArray !== output) {
        console.log("not the same")
        newWeight1 = Math.fround(newWeight1 + (values.learningRate * arr1ReveresedElement * (expectedOutputReveresedArray - output))).toFixed(2)
        newWeight2 = Math.fround(newWeight2 + (values.learningRate * arr2RevereseElement * (expectedOutputReveresedArray - output))).toFixed(2)
        console.log("two new weights", newWeight1, newWeight2)
         const pattern2 = (arr1ReveresedElement * newWeight1) + (arr2RevereseElement * newWeight2)
        const answer = pattern2<values.threshhold?0:1
allPatterns.push({weight1: newWeight1, weight2: newWeight2, input1: arr1ReveresedElement, input2: arr2RevereseElement, output: answer})
      }
      else{

        console.log("the same")
              allPatterns.push({ weight1: newWeight1, weight2: newWeight2, input1: arr1ReveresedElement, input2: arr2RevereseElement, output: output })
        
            }
      }
    return allPatterns;

    console.log("array elements", allPatterns);

  }
  const formik = useFormik({
    initialValues: {
      w1: 0.0,
      w2: 0.0,
      input1: 0,
      input2: 0,
      learningRate: 0.0,
      operation: 'AND',
      threshold: 0.0,
      outPut: 0.0,
      epoch: 1,
    },
    onSubmit: (values) => {
      const results = calculation(values)
      setResult(results)
      setShowTable(true)

    },
  })


  return (
    <>
      <Head>
        <title>Perceptron algorithm Computational intelligence group 10</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={formik.handleSubmit}>


        <Box
          borderRadius="lg"
          m={{ base: 5, md: 16, lg: 10 }}
          p={{ base: 5, lg: 16 }}>
          <Box>
            <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
              <Heading
                fontSize={{
                  base: '4xl',
                  md: '5xl',
                }}>
                PERCEPTRON ALGORITHM DEMO
              </Heading>

              <Stack
                spacing={{ base: 4, md: 8, lg: 20 }}
                direction={{ base: 'column', md: 'row' }}>
                <Stack
                  align="center"
                  justify="space-around"
                  direction={{ base: 'row', md: 'column' }}>

                  <Link href="#">
                    <IconButton
                      aria-label="github"
                      variant="ghost"
                      size="lg"
                      fontSize="3xl"

                      _hover={{
                        bg: 'blue.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      isRound
                    />
                  </Link>

                  <Link href="#">
                    <IconButton
                      aria-label="twitter"
                      variant="ghost"
                      size="lg"

                      _hover={{
                        bg: 'blue.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      isRound
                    />
                  </Link>

                  <Link href="#">
                    <IconButton
                      aria-label="linkedin"
                      variant="ghost"
                      size="lg"

                      _hover={{
                        bg: 'blue.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      isRound
                    />
                  </Link>
                </Stack>

                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue('gray.700', 'whiteAlpha.900')}
                  shadow="base">
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Input 1 </FormLabel>

                      <InputGroup>

                        <Input type="number" name="input1" placeholder="01110111010" onChange={formik.handleChange}
                          value={formik.values.input1} />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Input 2 </FormLabel>

                      <InputGroup>

                        <Input type="number" name="input2" placeholder="01110111010" onChange={formik.handleChange}
                          value={formik.values.input2} />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Weight 1 (w1)</FormLabel>

                      <InputGroup>

                        <Input
                          type="number"
                          name="w1"
                          placeholder="0.3"
                          onChange={formik.handleChange}
                          value={formik.values.w1}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Weight 2 (w2)</FormLabel>

                      <InputGroup>

                        <Input
                          type="number"
                          name="w2"
                          placeholder="0.1"
                          onChange={formik.handleChange}
                          value={formik.values.w2}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Threshold</FormLabel>

                      <InputGroup>

                        <Input
                          type="number"
                          name="threshold"
                          placeholder="0.1"
                          onChange={formik.handleChange}
                          value={formik.values.threshold}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired >
                      <FormLabel>Learning Rate</FormLabel>
                      <Select name='learningRate' placeholder='Select learning rate' onChange={formik.handleChange}
                        value={formik.values.learningRate}>


                        <option value={0.1}>0.1</option>
                        <option value={0.5}>0.5</option>
                        <option value={1.0}>1.0</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>operation type</FormLabel>

                      <Select placeholder='Select opertaion type' name="operation" onChange={formik.handleChange}
                        value={formik.values.operation}>
                        <option value={'AND'}>AND</option>
                        <option value={'OR'}>OR</option>
                        <option value={'NOT'}>NOT</option>

                      </Select>
                    </FormControl>

                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      color="white"
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type='submit'
                    >
                      Generate
                    </Button>
                  </VStack>
                </Box>
              </Stack>
            </VStack>
          </Box>
        </Box>
      </form>
      {showTable ?

        <Box padding={20} bg={'white'}>
          <TableContainer>
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th>Input 1</Th>
                  <Th>Input 2</Th>
                  <Th>Weight 1</Th>
                  <Th>Weight 2</Th>
                  <Th>Output</Th>
                </Tr>
              </Thead>
              <Tbody>

                {result && result.map((single) => <Tr>
                  <Td>{single.input1}</Td>
                  <Td>{single.input2}</Td>
                  <Td>{single.weight1}</Td>
                  <Td>{single.weight2}</Td>

                  <Td>{single.output}</Td>

                </Tr>)}
              </Tbody>

            </Table>
          </TableContainer> </Box> : null}

    </>
  );
}

