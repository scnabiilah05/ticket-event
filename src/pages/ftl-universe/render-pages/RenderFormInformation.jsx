import React, { useState, useRef } from "react";
import "../pages/RegistrationPages.css";
import { AiOutlineDown } from 'react-icons/ai';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DEFAULT_FORM = {
  memberType: "member",
  memberId: ["", "", "", "", ""],
  ektp: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const DEFAULT_ERROR = {
  memberId: false,
  ektp: false,
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
};

const validateEmail = (email) => /.+@.+\..+/.test(email);
const validatePhone = (phone) => phone.length >= 8;

const RenderFormInformation = ({ handleNextStep, handlePreviousStep, lengthMember = 2 }) => {
  // lengthMember: jumlah accordion step, default 3
  const [activeStep, setActiveStep] = useState(0); // index of open accordion
  const [formDataArray, setFormDataArray] = useState(
    Array.from({ length: lengthMember }, () => ({ ...DEFAULT_FORM }))
  );
  const [formErrors, setFormErrors] = useState(
    Array.from({ length: lengthMember }, () => ({ ...DEFAULT_ERROR }))
  );

  // Refs for PIN input
  const pinRefs = useRef(Array.from({ length: lengthMember }, () => [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]));

  // Handler for input change per step
  const handleInputChange = (idx, field, value) => {
    setFormDataArray(prev => {
      const updated = [...prev];
      if (field === "memberId") {
        updated[idx][field] = value; // value is array
      } else {
        updated[idx][field] = value;
      }
      return updated;
    });
    // Reset error for this field
    setFormErrors(prev => {
      const updated = [...prev];
      updated[idx][field] = false;
      return updated;
    });
  };

  // Validation per step
  const validateForm = (idx) => {
    const data = formDataArray[idx];
    const errors = { ...DEFAULT_ERROR };
    // Member ID: hanya jika member
    errors.memberId = data.memberType === "member"
      ? data.memberId.some(val => !val.trim())
      : false;
    // E-KTP: 16 digit
    errors.ektp = !/^\d{16}$/.test(data.ektp);
    // First Name
    errors.firstName = !data.firstName.trim();
    // Last Name
    errors.lastName = !data.lastName.trim();
    // Email
    errors.email = !validateEmail(data.email);
    // Phone
    errors.phone = !validatePhone(data.phone);
    setFormErrors(prev => {
      const updated = [...prev];
      updated[idx] = errors;
      return updated;
    });
    // Return true if no error
    return !Object.values(errors).some(Boolean);
  };

  // Next button handler
  const handleNext = (idx) => {
    if (validateForm(idx)) {
      if (idx < lengthMember - 1) {
        setActiveStep(idx + 1);
      } else {
        console.log('formDataArray:', formDataArray);
        handleNextStep();
      }
    }
  };

  // PIN input logic
  const handlePinChange = (idx, pinIdx, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const arr = [...formDataArray[idx].memberId];
    arr[pinIdx] = val;
    handleInputChange(idx, "memberId", arr);
    if (val && pinIdx < 4) {
      pinRefs.current[idx][pinIdx + 1].current.focus();
    }
  };

  const handlePinKeyDown = (idx, pinIdx, e) => {
    if (e.key === "Backspace" && !formDataArray[idx].memberId[pinIdx] && pinIdx > 0) {
      pinRefs.current[idx][pinIdx - 1].current.focus();
    }
  };

  const handlePinPaste = (idx, e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 5);
    if (paste.length > 0) {
      const arr = [...formDataArray[idx].memberId];
      for (let i = 0; i < 5; i++) {
        arr[i] = paste[i] || "";
        if (pinRefs.current[idx][i] && pinRefs.current[idx][i].current) {
          pinRefs.current[idx][i].current.value = arr[i];
        }
      }
      handleInputChange(idx, "memberId", arr);
      if (paste.length < 5) {
        pinRefs.current[idx][paste.length].current.focus();
      } else {
        pinRefs.current[idx][4].current.focus();
      }
      e.preventDefault();
    }
  };

  return (
    <div className="forminfo-bg">
      <div className="forminfo-header">
        <div>
          <h2 className="forminfo-title">Complete Your Registration to Continue</h2>
          <p className="forminfo-desc">
            To secure your seat in the FTL Universe, start by submitting your personal credentials — then choose the class experience that aligns with your mission.
          </p>
        </div>
        <img src="/images/Universe Logo - Transparent.png" alt="FTL Universe Logo" className="forminfo-logo" />
      </div>
      <div className="forminfo-card">
        {/* Accordion Steps */}
        {Array.from({ length: lengthMember }).map((_, idx) => (
          <div className="forminfo-accordion" key={idx}>
            <div
              className={`forminfo-accordion-header${activeStep === idx ? " active" : ""}`}
              onClick={() => setActiveStep(idx)}
            >
              <span className="forminfo-step-number">{idx + 1}</span>
              <span className="forminfo-step-title">Detail Information – {formDataArray[idx].memberType === "member" ? `Member ${idx + 1}` : "General"}</span>
              <span className="forminfo-accordion-icon">
                {activeStep === idx ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </div>
            <div className={`forminfo-accordion-body${activeStep === idx ? " active" : ""}`}>
              {/* Form, only render if active */}
              {activeStep === idx && (
                <>
                  <div className="forminfo-toggle-row">
                    <button
                      className={`forminfo-toggle-btn${formDataArray[idx].memberType === "member" ? " active" : ""}`}
                      onClick={() => handleInputChange(idx, "memberType", "member")}
                    >
                      Member
                    </button>
                    <button
                      className={`forminfo-toggle-btn${formDataArray[idx].memberType === "general" ? " active" : ""}`}
                      onClick={() => handleInputChange(idx, "memberType", "general")}
                    >
                      General
                    </button>
                  </div>
                  <div className="forminfo-form-row">
                    {/* Only show Member ID if memberType is 'member' */}
                    {formDataArray[idx].memberType === "member" && (
                      <div className="forminfo-form-group forminfo-memberid-group">
                        <label>Member ID</label>
                        <div className="forminfo-memberid-inputs">
                          {[0,1,2,3,4].map(i => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              className={`forminfo-memberid-input${formErrors[idx].memberId ? " forminfo-error" : ""}`}
                              value={formDataArray[idx].memberId[i]}
                              ref={pinRefs.current[idx][i]}
                              onChange={e => handlePinChange(idx, i, e)}
                              onKeyDown={e => handlePinKeyDown(idx, i, e)}
                              onPaste={e => handlePinPaste(idx, e)}
                              autoComplete="one-time-code"
                              inputMode="numeric"
                            />
                          ))}
                        </div>
                        {formErrors[idx].memberId && <div className="forminfo-error-msg">All Member ID fields are required</div>}
                      </div>
                    )}
                    {/* E-KTP Number */}
                    <div className={`forminfo-form-group forminfo-ektp-group${formDataArray[idx].memberType === 'general' ? ' forminfo-form-group--full' : ''}`}>
                      <label>E-KTP Number</label>
                      <div className="forminfo-ektp-row">
                        <input
                          type="text"
                          maxLength={16}
                          className={`forminfo-ektp-input${formErrors[idx].ektp ? " forminfo-error" : ""}`}
                          placeholder="Input your 16 E-KTP Number"
                          value={formDataArray[idx].ektp}
                          onChange={e => handleInputChange(idx, "ektp", e.target.value.replace(/[^0-9]/g, ""))}
                        />
                        {formDataArray[idx].memberType === "member" && (
                          <button className="forminfo-ektp-search-btn">
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2"/><path d="M15.5 15.5L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                        )}
                      </div>
                      {formErrors[idx].ektp && <div className="forminfo-error-msg">E-KTP must be 16 digits</div>}
                    </div>
                    {/* First Name & Email */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>First Name</label>
                        <input type="text" className={`forminfo-input${formErrors[idx].firstName ? " forminfo-error" : ""}`} placeholder="Input your first name" value={formDataArray[idx].firstName} onChange={e => handleInputChange(idx, "firstName", e.target.value)} />
                        {formErrors[idx].firstName && <div className="forminfo-error-msg">First Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>E-mail</label>
                        <input type="email" className={`forminfo-input${formErrors[idx].email ? " forminfo-error" : ""}`} placeholder="Input your email address" value={formDataArray[idx].email} onChange={e => handleInputChange(idx, "email", e.target.value)} />
                        {formErrors[idx].email && <div className="forminfo-error-msg">Valid email is required</div>}
                      </div>
                    </div>
                    {/* Last Name & Phone Number */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>Last Name</label>
                        <input type="text" className={`forminfo-input${formErrors[idx].lastName ? " forminfo-error" : ""}`} placeholder="Input your last name" value={formDataArray[idx].lastName} onChange={e => handleInputChange(idx, "lastName", e.target.value)} />
                        {formErrors[idx].lastName && <div className="forminfo-error-msg">Last Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>Phone Number</label>
                        <input type="text" className={`forminfo-input${formErrors[idx].phone ? " forminfo-error" : ""}`} placeholder="Input your phone number" value={formDataArray[idx].phone} onChange={e => handleInputChange(idx, "phone", e.target.value.replace(/[^0-9+]/g, ""))} />
                        {formErrors[idx].phone && <div className="forminfo-error-msg">Valid phone number is required</div>}
                      </div>
                    </div>
                  </div>
                  <div className="forminfo-btn-row">
                    <button className="forminfo-next-btn" onClick={() => handleNext(idx)}>
                      Save & Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RenderFormInformation };

