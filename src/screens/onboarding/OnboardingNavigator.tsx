import { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import WhyHereScreen from "./WhyHereScreen";
import SpecialInterestsScreen from "./SpecialInterestsScreen";
import AllSetScreen from "./AllSetScreen";

type Props = {
  onComplete: () => void;
};

export default function OnboardingNavigator({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [reasons, setReasons] = useState<string[]>([]);

  switch (step) {
    case 0:
      return <WelcomeScreen onNext={() => setStep(1)} />;
    case 1:
      return (
        <WhyHereScreen
          onNext={(selected) => {
            setReasons(selected);
            setStep(2);
          }}
        />
      );
    case 2:
      return <SpecialInterestsScreen onNext={() => setStep(3)} />;
    case 3:
      return <AllSetScreen onDone={onComplete} />;
    default:
      return <WelcomeScreen onNext={() => setStep(1)} />;
  }
}
