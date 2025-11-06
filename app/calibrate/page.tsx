"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import DiceButton from "@/app/ui/button";
import { useAuth } from "@/app/authctx";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [answers, setAnswers] = useState({
    question1: [] as number[],
    question2: [] as number[],
    question3: [] as number[],
  });

  const [averages, setAverages] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
  });

  const calculateAverage = (values: number[]) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const { calibrationComplete, setCalibrationComplete } = useAuth();

  useEffect(() => {
    setAverages({
      question1: calculateAverage(answers.question1),
      question2: calculateAverage(answers.question2),
      question3: calculateAverage(answers.question3),
    });
  }, [answers]);

  const handleChange = (questionKey: keyof typeof answers, value: number) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionKey];
      // Check if the value is already selected
      if (currentAnswers.includes(value)) {
        // Remove the value if already selected
        return {
          ...prevAnswers,
          [questionKey]: currentAnswers.filter((answer) => answer !== value),
        };
      } else {
        // Allow adding the value only if fewer than 2 selections have been made
        if (currentAnswers.length < 2) {
          return { ...prevAnswers, [questionKey]: [...currentAnswers, value] };
        } else {
          return prevAnswers;
        }
      }
    });
  };

  const handleSubmit = () => {
    if (answers.question1.length === 0) {
      alert("Please select at least one option for Question 1.");
      return;
    }
    if (answers.question2.length === 0) {
      alert("Please select at least one option for Question 2.");
      return;
    }
    if (answers.question3.length === 0) {
      alert("Please select at least one option for Question 3.");
      return;
    }
    setCalibrationComplete(true);
    onOpen();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h4 className="mb-4 text-center text-3xl ">
        CRRA Utility Calibration<sup className="text-base">1</sup>
      </h4>

      <div className="mb-6">
        <p className="mb-4 text-slate-200 ">
          <span className="font-bold">1. </span>Imagine you are presented with a
          one-time investment opportunity where the outcome depends on whether a
          fair coin flip comes up heads or tails. The coin flip is uncorrelated
          with your existing portfolio of investments and consumption and
          bequest plans. If it comes up tails, you lose 10% of your wealth.
          Which of the following amounts of upside would make you feel most
          ambivalent between accepting or declining the coin flip? If you can’t
          decide between two options, tick both. In case it helps, the Sharpe
          Ratios of the different options are 0.05, 0.11, 0.18, 0.26, and 0.34
          respectively.
        </p>
        <div className="flex flex-col">
          {[
            { label: "11%", value: 1 },
            { label: "12.5%", value: 2 },
            { label: "14.5%", value: 3 },
            { label: "17%", value: 4 },
            { label: "20.5%", value: 5 },
          ].map((option) => (
            <Checkbox
              key={option.value}
              isSelected={answers.question1.includes(option.value)}
              onChange={() => handleChange("question1", option.value)}
              className="text-md mb-0.5"
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-4 text-slate-200">
          <span className="font-bold">2. </span>Same question as above, but now
          the downside if the coin comes up tails is you lose 20% of your
          wealth. Which upside would make you feel most ambivalent? Again, if
          you are finding two answers close, tick both. The Sharpe Ratios are
          0.11, 0.25, 0.44, and 0.80 respectively.
        </p>
        <div className="flex flex-col">
          {[
            { label: "25%", value: 1 },
            { label: "33%", value: 2 },
            { label: "50%", value: 3 },
            { label: "175%", value: 4 },
            {
              label:
                "I wouldn’t risk losing 20% of my wealth for any of these upsides.",
              value: 5,
            },
          ].map((option) => (
            <Checkbox
              key={option.value}
              isSelected={answers.question2.includes(option.value)}
              onChange={() => handleChange("question2", option.value)}
              className="text-md mb-0.5"
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p className="mb-4  text-slate-200">
          <span className="font-bold">3. </span>Still flipping a fair coin. Now
          imagine that if it comes up heads, your wealth will increase 5-fold.
          What’s the most downside you’d accept to take that flip? Again, if
          your answer is between two options, please tick both.
        </p>
        <div className="flex flex-col">
          {[
            { label: "80%", value: 1 },
            { label: "50%", value: 2 },
            { label: "30%", value: 3 },
            { label: "20%", value: 4 },
            { label: "15%", value: 5 },
          ].map((option) => (
            <Checkbox
              key={option.value}
              isSelected={answers.question3.includes(option.value)}
              onChange={() => handleChange("question3", option.value)}
              className="text-md mb-0.5"
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
      </div>
      <div className="flex  justify-center my-4">
        <DiceButton onClick={handleSubmit}>Submit</DiceButton>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <p className="text-red-600">
              Coefficient of Relative Risk Aversion
            </p>
          </ModalHeader>
          <ModalBody>
            <p>
              RRA ={" "}
              {(
                (averages.question1 + averages.question2 + averages.question3) /
                3
              ).toFixed(2)}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <hr className="w-full border-t-2 border-slate-400 mb-4" />
      <Link
        href="https://elmwealth.com/measuring-the-fabric-of-felicity/"
        className="inline text-left text-blue-300 mt-6"
      >
        <span className="whitespace-nowrap mr-1">1. From</span>
        <em>Measuring the Fabric of Felicity</em>, by Victor Haghani and James
        White
      </Link>
    </div>
  );
}
