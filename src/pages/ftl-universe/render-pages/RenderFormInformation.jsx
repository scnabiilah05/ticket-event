import React, { useState, useRef } from "react";
import "../pages/RegistrationPages.css";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatPriceFromString } from "../../../utils/PriceUtils";
import axios from "axios";

const DEFAULT_FORM = {
  memberType: "member",
  memberId: "",
  ektp: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const DEFAULT_ERROR = {
  memberId: false,
  memberIdDuplicate: false,
  ektp: false,
  ektpDuplicate: false,
  firstName: false,
  lastName: false,
  email: false,
  emailDuplicate: false,
  phone: false,
  phoneDuplicate: false,
};

const validateEmail = (email) => /.+@.+\..+/.test(email);
const validatePhone = (phone) => phone.length >= 8;

const checkDuplicateData = (formDataArray, currentIndex, field, value) => {
  if (!value.trim()) return false; 
  
  return formDataArray.some((data, index) => {
    if (index === currentIndex) return false; 
    
    switch (field) {
      case 'memberId':
        return data.memberType === 'member' && data.memberId === value;
      case 'ektp':
        return data.ektp === value;
      case 'email':
        return data.email === value;
      case 'phone':
        return data.phone === value;
      default:
        return false;
    }
  });
};

const RenderFormInformation = ({ handleNextStep, handlePreviousStep, lengthMember, selectedPackage }) => {
  const [isLoading, setIsLoading] = useState({getMember: false, checkMember: false});
  const [activeStep, setActiveStep] = useState(0); // index of open accordion
  const [formDataArray, setFormDataArray] = useState(
    Array.from({ length: lengthMember }, () => ({ ...DEFAULT_FORM }))
  );
  const [formErrors, setFormErrors] = useState(
    Array.from({ length: lengthMember }, () => ({ ...DEFAULT_ERROR }))
  );
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info' });


  // Handler for input change per step
  const handleInputChange = (idx, field, value) => {
    setFormDataArray(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
    // Reset error for this field and its duplicate error
    setFormErrors(prev => {
      const updated = [...prev];
      updated[idx][field] = false;
      updated[idx][`${field}Duplicate`] = false;
      return updated;
    });
  };

  // Validation per step
  const validateForm = (idx) => {
    const data = formDataArray[idx];
    const errors = { ...DEFAULT_ERROR };
    
    // Member ID: hanya jika member
    errors.memberId = data.memberType === "member"
      ? !data.memberId.trim()
      : false;
    
    // Check for duplicate Member ID
    if (data.memberType === "member" && data.memberId.trim()) {
      errors.memberIdDuplicate = checkDuplicateData(formDataArray, idx, 'memberId', data.memberId);
    }
    
    // E-KTP: 16 digit
    errors.ektp = !/^\d{16}$/.test(data.ektp);
    
    // Check for duplicate E-KTP
    if (data.ektp.trim()) {
      errors.ektpDuplicate = checkDuplicateData(formDataArray, idx, 'ektp', data.ektp);
    }
    
    // First Name
    errors.firstName = !data.firstName.trim();
    // Last Name
    errors.lastName = !data.lastName.trim();
    
    // Email
    errors.email = !validateEmail(data.email);
    
    if (data.email.trim()) {
      errors.emailDuplicate = checkDuplicateData(formDataArray, idx, 'email', data.email);
    }
    
    errors.phone = !validatePhone(data.phone);
    
    if (data.phone.trim()) {
      errors.phoneDuplicate = checkDuplicateData(formDataArray, idx, 'phone', data.phone);
    }
    
    setFormErrors(prev => {
      const updated = [...prev];
      updated[idx] = errors;
      return updated;
    });
    return !Object.values(errors).some(Boolean);
  };

  const handleNext = async (idx) => {
    if (validateForm(idx)) {
      const isMember = await checkMember(formDataArray[idx].ektp, formDataArray[idx].email);

      if (isMember.status && formDataArray[idx].memberType === 'general') {
        setPopup({ show: true, message: isMember.message, type: 'error' });
        return;
      }

      if (idx < lengthMember - 1) {
        setActiveStep(idx + 1);
      } else {
        // Check if there are any duplicate errors before proceeding
        const hasDuplicateErrors = formDataArray.some((_, formIdx) => {
          const errors = formErrors[formIdx];
          return errors.memberIdDuplicate || errors.ektpDuplicate || errors.emailDuplicate || errors.phoneDuplicate;
        });
        
        if (hasDuplicateErrors) {
          setPopup({ show: true, message: 'Please resolve duplicate data before proceeding.', type: 'error' });
          return;
        }
        
        const allFormsValid = formDataArray.every((_, formIdx) => !hasFormErrors(formIdx));
        
        if (allFormsValid) {
          console.log('formDataArray:', formDataArray);
          handleNextStep();
        } else {
          setPopup({ show: true, message: 'Please complete all forms correctly before proceeding.', type: 'error' });
        }
      }
    }
  };

  const hasFormErrors = (idx) => {
    const data = formDataArray[idx];
    const errors = { ...DEFAULT_ERROR };
    
    // Member ID: hanya jika member
    errors.memberId = data.memberType === "member"
      ? !data.memberId.trim()
      : false;
    
    // Check for duplicate Member ID
    if (data.memberType === "member" && data.memberId.trim()) {
      errors.memberIdDuplicate = checkDuplicateData(formDataArray, idx, 'memberId', data.memberId);
    }
    
    // E-KTP: 16 digit
    errors.ektp = !/^\d{16}$/.test(data.ektp);
    
    // Check for duplicate E-KTP
    if (data.ektp.trim()) {
      errors.ektpDuplicate = checkDuplicateData(formDataArray, idx, 'ektp', data.ektp);
    }
    
    // First Name
    errors.firstName = !data.firstName.trim();
    // Last Name
    errors.lastName = !data.lastName.trim();
    // Email
    errors.email = !validateEmail(data.email);
    
    if (data.email.trim()) {
      errors.emailDuplicate = checkDuplicateData(formDataArray, idx, 'email', data.email);
    }
    
    // Phone
    errors.phone = !validatePhone(data.phone);
    
    if (data.phone.trim()) {
      errors.phoneDuplicate = checkDuplicateData(formDataArray, idx, 'phone', data.phone);
    }
    
    return Object.values(errors).some(Boolean);
  };

  const isFormComplete = (idx) => {
    const data = formDataArray[idx];
    const errors = { ...DEFAULT_ERROR };
    
    // Member ID: hanya jika member
    errors.memberId = data.memberType === "member"
      ? !data.memberId.trim()
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
    
    // Don't consider duplicate errors as blocking form completion
    // This allows users to continue even if there are duplicates
    return !Object.values(errors).some(Boolean);
  };

  const arePreviousFormsComplete = (idx) => {
    for (let i = 0; i < idx; i++) {
      if (!isFormComplete(i)) {
        return false;
      }
    }
    return true;
  };

  const isAccordionLocked = (idx) => {
    return idx > 0 && !arePreviousFormsComplete(idx);
  };

  const getMember = async (ktp, memberId, idx) => {
    setIsLoading({...isLoading, getMember: true});
    let params = { ktp: ktp}

    if (memberId !== ""  || memberId !== null) {
      params.id_gymmaster = memberId;
    }

    try {
      const response = await axios.get(`/universe/get_member`, {
        params: params,
      });

      if (response.data.status == 'success') {
        const data = await response.data.data;
        setFormDataArray(prev => {
          const updated = [...prev];
          updated[idx].firstName = data.first_name;
          updated[idx].lastName = data.last_name;
          updated[idx].email = data.email;
          updated[idx].phone = data.phone;
          return updated;
        });
      } else {
        setPopup({ show: true, message: response.data.message || 'Failed to fetch member data', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      setPopup({ show: true, message: 'Member not found. Please ensure that both the Member ID and National ID (KTP) number are correct.', type: 'error' });
    } finally {
      setIsLoading({...isLoading, getMember: false});
    }
  };

  const checkMember = async (ktp, email) => {
    setIsLoading({...isLoading, checkMember: true});

    let params = { ktp: ktp };
    if (email === "" || email === null) {
      params = { email: email };
    }

    try {
      const response = await axios.get(`/universe/cek_member`, {
        params: params,
      });

      const responseData = response.data;
      if (responseData.status === 'success') {
        return { status: false, message: responseData.message };
      }
      return { status: true, message: responseData.message };
    } catch (error) {
      console.error('Error checking member:', error);
      return { status: true, message: "You are registered as a member. Please select a member type to continue." };
    } finally {
      setIsLoading({...isLoading, checkMember: false});
    }
  };

  return (
    <div className="terms-bg">
      <div className="header-row">
        <div>
          <h2 className="title-header">Complete Your Registration to Continue</h2>
          <p className="desc-header">
            To secure your seat in the FTL Universe, start by submitting your personal credentials — then choose the class experience that aligns with your mission.
          </p>
        </div>
        <img src="/images/Universe Logo - Transparent.png" alt="FTL Universe Logo" className="logo-header" />
      </div>
      <div className="divider-header"></div>
      <div className="forminfo-card-header-title">Choosen Package:</div>
      <div className="forminfo-card-header">
        <div className="forminfo-card-header-content">
          <div className="forminfo-card-header-package">
            <span className="forminfo-card-header-package-name">{selectedPackage?.title || "All Classes Pass"}</span>
          </div>
          <div className="forminfo-card-header-price">
            {selectedPackage?.strike_price && <span className="forminfo-card-header-oldprice">{`Rp ${formatPriceFromString(selectedPackage?.strike_price)}`}</span>}
            <span className="forminfo-card-header-mainprice">{`Rp ${formatPriceFromString(selectedPackage?.price)}`}</span>
            <span className="forminfo-card-header-perclass">{`Rp ${formatPriceFromString(selectedPackage?.class_price)} /class`}</span>
          </div>
        </div>
      </div>
      <div className="forminfo-card">
        {/* Accordion Steps */}
        {Array.from({ length: lengthMember }).map((_, idx) => (
          <div className="forminfo-accordion" key={idx}>
            <div
              className={`forminfo-accordion-header${activeStep === idx ? " active" : ""}${hasFormErrors(idx) ? " forminfo-accordion-header--error" : ""}`}
              onClick={() => {
                if (!isAccordionLocked(idx)) {
                  setActiveStep(idx);
                }
              }}
            >
              <span className="forminfo-step-number">{idx + 1}</span>
              <span className="forminfo-step-title">
                Detail Information – {formDataArray[idx].memberType === "member" ? `Member ${idx + 1}` : "General"}
                {/* {hasFormErrors(idx) && <span className="forminfo-step-error-indicator">⚠️</span>} */}
              </span>
              <span className="forminfo-accordion-icon">
                {activeStep === idx ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </div>
            <div className={`forminfo-accordion-body${activeStep === idx ? " active" : ""}`}>
              {/* Form, only render if active and not locked */}
              {activeStep === idx && !isAccordionLocked(idx) && (
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
                        <input
                          type="text"
                          className={`forminfo-input${formErrors[idx].memberId || formErrors[idx].memberIdDuplicate ? " forminfo-error" : ""}`}
                          placeholder="Input your Member ID"
                          value={formDataArray[idx].memberId}
                          onChange={e => handleInputChange(idx, "memberId", e.target.value.replace(/[^0-9]/g, ""))}
                          inputMode="numeric"
                        />
                        {formErrors[idx].memberId && <div className="forminfo-error-msg">Member ID is required</div>}
                        {formErrors[idx].memberIdDuplicate && <div className="forminfo-error-msg">Member ID already exists</div>}
                      </div>
                    )}
                    {/* E-KTP Number */}
                    <div className={`forminfo-form-group forminfo-ektp-group${formDataArray[idx].memberType === 'general' ? ' forminfo-form-group--full' : ''}`}>
                      <label>E-KTP Number</label>
                      <div className="forminfo-ektp-row">
                        <input
                          type="text"
                          maxLength={16}
                          className={`forminfo-ektp-input${formErrors[idx].ektp || formErrors[idx].ektpDuplicate ? " forminfo-error" : ""}`}
                          placeholder="Input your 16 E-KTP Number"
                          value={formDataArray[idx].ektp}
                          onChange={e => handleInputChange(idx, "ektp", e.target.value.replace(/[^0-9]/g, ""))}
                        />
                        {formDataArray[idx].memberType === "member" && (
                          <button className="forminfo-ektp-search-btn" onClick={() => getMember(formDataArray[idx].ektp, formDataArray[idx].memberId, idx)}>
                            {isLoading.getMember ? <div className="forminfo-ektp-search-btn-loading"></div> : <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2"/><path d="M15.5 15.5L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                          </button>
                        )}
                      </div>
                      {formErrors[idx].ektp && <div className="forminfo-error-msg">E-KTP must be 16 digits</div>}
                      {formErrors[idx].ektpDuplicate && <div className="forminfo-error-msg">E-KTP already exists</div>}
                    </div>
                    {/* First Name & Email */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>First Name</label>
                        <input type="text" disabled={formDataArray[idx].memberType === "member"} className={`forminfo-input${formErrors[idx].firstName ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].memberType === "general" ? "Input your first name" : ""} value={formDataArray[idx].firstName} onChange={e => handleInputChange(idx, "firstName", e.target.value)} />
                        {formErrors[idx].firstName && <div className="forminfo-error-msg">First Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>E-mail</label>
                        <input type="email" disabled={formDataArray[idx].memberType === "member"} className={`forminfo-input${formErrors[idx].email || formErrors[idx].emailDuplicate ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].memberType === "general" ? "Input your email address" : ""} value={formDataArray[idx].email} onChange={e => handleInputChange(idx, "email", e.target.value)} />
                        {formErrors[idx].email && <div className="forminfo-error-msg">Valid email is required</div>}
                        {formErrors[idx].emailDuplicate && <div className="forminfo-error-msg">Email already exists</div>}
                      </div>
                    </div>
                    {/* Last Name & Phone Number */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>Last Name</label>
                        <input type="text" disabled={formDataArray[idx].memberType === "member"} className={`forminfo-input${formErrors[idx].lastName ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].memberType === "general" ? "Input your last name" : ""} value={formDataArray[idx].lastName} onChange={e => handleInputChange(idx, "lastName", e.target.value)} />
                        {formErrors[idx].lastName && <div className="forminfo-error-msg">Last Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>Phone Number</label>
                        <input type="text" disabled={formDataArray[idx].memberType === "member"} className={`forminfo-input${formErrors[idx].phone || formErrors[idx].phoneDuplicate ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].memberType === "general" ? "Input your phone number" : ""} value={formDataArray[idx].phone} onChange={e => handleInputChange(idx, "phone", e.target.value.replace(/[^0-9+]/g, ""))} />
                        {formErrors[idx].phone && <div className="forminfo-error-msg">Valid phone number is required</div>}
                        {formErrors[idx].phoneDuplicate && <div className="forminfo-error-msg">Phone number already exists</div>}
                      </div>
                    </div>
                  </div>
                  <div className="forminfo-btn-row">
                    <button className="forminfo-next-btn" onClick={() => handleNext(idx)}>
                      {idx === lengthMember - 1 ? "Save & Next" : "Next"}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
      {/* Bottom right button row */}
      <div className="terms-btn-row">
        <button
          className="terms-btn terms-btn-prev"
          onClick={handlePreviousStep}
        >
          Back
        </button>
      </div>
      
      {/* Popup Modal */}
      {popup.show && (
        <div className="popup-overlay" onClick={() => setPopup({ show: false, message: '', type: 'info' })}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className={`popup-icon ${popup.type}`}>
              {popup.type === 'error' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="popup-message">
              {popup.message}
            </div>
            <button 
              className="popup-button"
              onClick={() => setPopup({ show: false, message: '', type: 'info' })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { RenderFormInformation };

