import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RegistrationPages.css";
import { tickets, packages } from "../../../datas/ftl-universe/packages";
import { RenderTermConditions } from "../render-pages/RenderTermConditions";
import { RenderPackageSelection } from "../render-pages/RenderPackageSelection";
import { RenderTicketSelection } from "../render-pages/RenderTicketSelection";
import { RenderFormInformation } from "../render-pages/RenderFormInformation";
import { RenderClassSelection } from "../render-pages/RenderClassSelection";

// Step constants for better maintainability
const STEPS = {
  TICKET_SELECTION: 1,
  TERMS_CONDITIONS: 2,
  PACKAGE_SELECTION: 3,
  FORM_INFORMATION: 4,
  CLASS_SELECTION: 5,
  // Add more steps here as needed
};

const DEFAULT_FORM = {
  // memberType: "member",
  is_member: 1,
  id_gymmaster: "",
  ktp: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

const RegistrationPages = () => {
  const [isLoading, setIsLoading] = useState({ticketEvent: false});
  const [ticketEvent, setTicketEvent] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentStep, setCurrentStep] = useState(STEPS.TICKET_SELECTION);
  const [selectedTab, setSelectedTab] = useState('single');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isGroup, setIsGroup] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Moved formDataArray state from RenderFormInformation
  const [formDataArray, setFormDataArray] = useState([ { ...DEFAULT_FORM } ]);
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Initialize formDataArray when selectedPackage changes
  useEffect(() => {
    if (selectedPackage?.total_member) {
      setFormDataArray(Array.from({ length: selectedPackage.total_member }, () => ({ ...DEFAULT_FORM })));
    }
  }, [selectedPackage]);

  const getTicketEvent = async () => {
    setIsLoading({ ...isLoading, ticketEvent: true });
    try {
      const response = await axios.get("/universe/get_type");
      if (response.data.status == 'success') {
        setTicketEvent(response.data.data);
      }
    } catch (error) {
      console.error(error);
      // setTicketEvent(tickets);
    } finally {
      setIsLoading({ ...isLoading, ticketEvent: false });
    }
  };

  const handleSelectTicket = async (item) => {
    setIsSelecting(true);
    setSelectedTicket(item);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSelecting(false);
    setCurrentStep(STEPS.TERMS_CONDITIONS);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    // Reset related states when going back
    if (currentStep === STEPS.PACKAGE_SELECTION) {
      // setSelectedPackage(null);
    }
    if (currentStep === STEPS.FORM_INFORMATION) {
      // Reset form states if any
    }
    if (currentStep === STEPS.CLASS_SELECTION) {
      // Reset class selection states if any
    }
  };

  // Countdown timer effect
  // useEffect(() => {
  //   const targetDate = new Date('2025-08-15T00:00:00').getTime();
  //   const timer = setInterval(() => {
  //     const now = new Date().getTime();
  //     const distance = targetDate - now;
  //     if (distance > 0) {
  //       setTimeLeft({
  //         days: Math.floor(distance / (1000 * 60 * 60 * 24)),
  //         hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  //         minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
  //         seconds: Math.floor((distance % (1000 * 60)) / 1000)
  //       });
  //     }
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    getTicketEvent();
  }, []);

  // Render functions for each step
  const renderTicketSelection = () => (
    <RenderTicketSelection
      timeLeft={timeLeft}
      selectedTicket={selectedTicket}
      handleSelectTicket={handleSelectTicket}
      ticketEvent={ticketEvent}
      isSelecting={isSelecting}
    />
  );

  const renderTerms = () => (
    <RenderTermConditions 
      handleNextStep={handleNextStep} 
      handlePreviousStep={handlePreviousStep}
    />
  );

  const renderPackageSelection = () => (
    <RenderPackageSelection
      selectedTab={selectedTab}
      selectedTicket={selectedTicket}
      selectedPackage={selectedPackage}
      setSelectedTab={setSelectedTab}
      setSelectedPackage={setSelectedPackage}
      handlePreviousStep={handlePreviousStep}
      handleNextStep={handleNextStep}
      isGroup={isGroup}
      setIsGroup={setIsGroup}
    />
  );


  const renderFormInformation = () => (
    <RenderFormInformation 
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      lengthMember={selectedPackage?.total_member || 2}
      selectedPackage={selectedPackage}
      formDataArray={formDataArray}
      setFormDataArray={setFormDataArray}
    />
  );

  const renderClassSelection = () => (
    <RenderClassSelection 
      selectedPackage={selectedPackage}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      selectedClass={selectedClass}
      setSelectedClass={setSelectedClass}
      lengthClass={selectedPackage?.total_class}
      formDataArray={formDataArray}
    />
  );

  // Step mapping for easy maintenance
  const stepComponents = {
    [STEPS.TICKET_SELECTION]: renderTicketSelection,
    [STEPS.TERMS_CONDITIONS]: renderTerms,
    [STEPS.PACKAGE_SELECTION]: renderPackageSelection,
    [STEPS.FORM_INFORMATION]: renderFormInformation,
    [STEPS.CLASS_SELECTION]: renderClassSelection,
  };

  // Main UI with optimized conditional rendering
  return (
    <div className="ftl-bg">
      {stepComponents[currentStep]?.() || (
        <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
          Step {currentStep} not found. Available steps: {Object.keys(stepComponents).join(', ')}
        </div>
      )}
    </div>
  );
};

export default RegistrationPages;
