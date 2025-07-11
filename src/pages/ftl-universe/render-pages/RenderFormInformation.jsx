import React, { useState, useRef, useEffect } from "react";
import "../pages/RegistrationPages.css";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { formatPriceFromString } from "../../../utils/PriceUtils";
import axios from "axios";

const DEFAULT_FORM = {
  is_member: 1,
  id_gymmaster: "",
  ktp: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  instagram: "",
};

const DEFAULT_ERROR = {
  id_gymmaster: false,
  id_gymmasterDuplicate: false,
  is_ktp: false,
  passpor: false,
  ktp: false,
  ktpDuplicate: false,
  passporDuplicate: false,
  first_name: false,
  last_name: false,
  email: false,
  emailDuplicate: false,
  phone: false,
  phoneDuplicate: false,

};

const validateEmail = (email) => /.+@.+\..+/.test(email);
const validatePhone = (phone) => phone.length >= 8;



// Validasi paspor yang dinamis untuk berbagai negara
const validatePassport = (passport) => {
  if (!passport?.trim()) return false;
  
  const cleanPassport = passport?.trim().toUpperCase();
  
  // Validasi umum untuk format paspor internasional:
  // - Panjang 6-9 karakter
  // - Kombinasi huruf dan angka
  // - Bisa dimulai dengan huruf atau angka
  // - Mendukung berbagai format dari berbagai negara
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  
  // Validasi tambahan untuk memastikan tidak semua karakter sama
  const allSameChar = /^(.)\1*$/;
  if (allSameChar.test(cleanPassport)) {
    return false;
  }
  
  return passportRegex.test(cleanPassport);
};

const checkDuplicateData = (formDataArray, currentIndex, field, value) => {
  if (!value.trim()) return false; 
  
  return formDataArray.some((data, index) => {
    if (index === currentIndex) return false; 
    
    switch (field) {
      case 'id_gymmaster':
        return data.is_member === 1 && data.id_gymmaster === value;
      case 'ktp':
        return data.ktp === value;
      case 'passpor':
        return data.passpor === value;
      case 'email':
        return data.email === value;
      case 'phone':
        return data.phone === value;
      default:
        return false;
    }
  });
};

const RenderFormInformation = ({ handleNextStep, handlePreviousStep, lengthMember, selectedPackage, formDataArray, setFormDataArray }) => {
  const [isLoading, setIsLoading] = useState({getMember: false, checkMember: false});
  const [activeStep, setActiveStep] = useState(0); // index of open accordion
  const [formErrors, setFormErrors] = useState(
    Array.from({ length: lengthMember }, () => ({ ...DEFAULT_ERROR }))
  );
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info' });

  // Initialize formErrors when lengthMember changes
  useEffect(() => {
    setFormErrors(Array.from({ length: lengthMember }, () => ({ ...DEFAULT_ERROR })));
  }, [lengthMember]);

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
    errors.id_gymmaster = data.is_member === 1
      ? !data.id_gymmaster.trim()
      : false;
    
    // Check for duplicate Member ID
    if (data.is_member === 1 && data.id_gymmaster.trim()) {
      errors.id_gymmasterDuplicate = checkDuplicateData(formDataArray, idx, 'id_gymmaster', data.id_gymmaster);
    }
    
    // E-KTP: 16 digit (hanya untuk member)
    if (data.is_member === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 0) {
      errors.passpor = !validatePassport(data.passpor);
    }
    
    // Check for duplicate E-KTP (hanya untuk member)
    if (data.is_member === 1 && data.ktp.trim()) {
      errors.ktpDuplicate = checkDuplicateData(formDataArray, idx, 'ktp', data.ktp);
    }
    
    // Check for duplicate Passport (hanya untuk non-member)
    if (data.is_member === 0 && data.passpor && data.passpor.trim()) {
      errors.passporDuplicate = checkDuplicateData(formDataArray, idx, 'passpor', data.passpor);
    }
    
    // First Name
    errors.first_name = !data.first_name.trim();
    // Last Name
    errors.last_name = !data.last_name.trim();
    
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
      const idNumber = formDataArray[idx].is_member === 1 ? formDataArray[idx].ktp : formDataArray[idx].is_ktp === 1 ? formDataArray[idx].ktp : formDataArray[idx].passpor;
      console.log('idNumber', idNumber)
      const isMember = await checkMember(idNumber, formDataArray[idx].email, idx);

      if (isMember.status && formDataArray[idx].is_member === 0) {
        setPopup({ show: true, message: isMember.message, type: 'error' });
        return;
      }

      if (idx < lengthMember - 1) {
        console.log('masuk sini lah', isAccordionLocked(idx))
        setActiveStep(idx + 1);
      } else {
        console.log('masuk sini')
        // Check if there are any duplicate errors before proceeding
        const hasDuplicateErrors = formDataArray.some((_, formIdx) => {
          const errors = formErrors[formIdx];
          return errors.id_gymmasterDuplicate || errors.ktpDuplicate || errors.passporDuplicate || errors.emailDuplicate || errors.phoneDuplicate;
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
    errors.id_gymmaster = data.is_member === 1
      ? !data.id_gymmaster?.trim()
      : false;
    
    // Check for duplicate Member ID
    if (data.is_member === 1 && data.id_gymmaster.trim()) {
      errors.id_gymmasterDuplicate = checkDuplicateData(formDataArray, idx, 'id_gymmaster', data.id_gymmaster);
    }
    
    // E-KTP: 16 digit (hanya untuk member)
    if (data.is_member === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 0) {
      // Passport: menggunakan validasi yang fleksibel untuk berbagai negara (hanya untuk non-member)
      errors.passpor = !validatePassport(data.passpor);
    }
    
    // Check for duplicate E-KTP (hanya untuk member)
    if (data.is_member === 1 && data.ktp.trim()) {
      errors.ktpDuplicate = checkDuplicateData(formDataArray, idx, 'ktp', data.ktp);
    }
    
    // Check for duplicate Passport (hanya untuk Non-member)
    if (data.is_member === 0 && data.is_ktp === 0 && data.passpor && data.passpor.trim()) {
      errors.passporDuplicate = checkDuplicateData(formDataArray, idx, 'passpor', data.passpor);
    }
    
    // First Name
    errors.first_name = !data.first_name;
    // Last Name
    errors.last_name = !data.last_name;
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
    errors.id_gymmaster = data.is_member === 1
      ? !data.id_gymmaster.trim()
      : false;
    
    // E-KTP: 16 digit
    if (data.is_member === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 1) {
      errors.ktp = !/^\d{16}$/.test(data.ktp);
    } else if (data.is_member === 0 && data.is_ktp === 0) {
      errors.passpor = !validatePassport(data.passpor);
    }
    
    // First Name
    errors.first_name = !data.first_name.trim();
    // Last Name
    errors.last_name = !data.last_name.trim();
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

  const getMember = async (ktp, id_gymmaster, idx) => {
    setIsLoading({...isLoading, getMember: true});
    let params = { ktp: ktp}

    if (id_gymmaster !== ""  && id_gymmaster !== null) {
      params.id_gymmaster = id_gymmaster;
    }

    try {
      const response = await axios.get(`/universe/get_member`, {
        params: params,
      });

      if (response.data.status == 'success') {
        const data = await response.data.data;
        setFormDataArray(prev => {
          const updated = [...prev];
          updated[idx].first_name = data.first_name;
          updated[idx].last_name = data.last_name;
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
                Detail Information – {formDataArray[idx].is_member === 1 ? `Member ${idx + 1}` : "Non-member"}
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
                      className={`forminfo-toggle-btn${formDataArray[idx].is_member === 1 ? " active" : ""}`}
                      onClick={() => handleInputChange(idx, "is_member", 1)}
                    >
                      Member
                    </button>
                    <button
                      className={`forminfo-toggle-btn${formDataArray[idx].is_member === 0 ? " active" : ""}`}
                      onClick={() => handleInputChange(idx, "is_member", 0)}
                    >
                      Non-member
                    </button>
                  </div>
                  <div className="forminfo-form-row">
                    {/* Only show Member ID if is_member is 1 */}
                      {formDataArray[idx].is_member === 1 ? (
                        <div className="forminfo-form-group forminfo-id_gymmaster-group">
                          <label>Member ID</label>
                          <input
                            type="text"
                            className={`forminfo-input${formErrors[idx].id_gymmaster || formErrors[idx].id_gymmasterDuplicate ? " forminfo-error" : ""}`}
                            placeholder="Input your Member ID"
                            value={formDataArray[idx].id_gymmaster}
                            onChange={e => handleInputChange(idx, "id_gymmaster", e.target.value.replace(/[^0-9]/g, ""))}
                            inputMode="numeric"
                          />
                          {formErrors[idx].id_gymmaster && <div className="forminfo-error-msg">Member ID is required</div>}
                          {formErrors[idx].id_gymmasterDuplicate && <div className="forminfo-error-msg">Member ID already exists</div>}
                        </div>
                      ) : (
                        <div className="forminfo-form-group forminfo-id_gymmaster-group">
                          <label>Select ID</label>
                          <select
                            className={`forminfo-input${formErrors[idx].is_ktp ? " forminfo-error" : ""}`}
                            placeholder="Select ID"
                            value={formDataArray[idx].is_ktp}
                            onChange={e => handleInputChange(idx, "is_ktp", e.target.value === "1" ? 1 : 0)}
                            // inputMode="numeric"
                          >
                            <option value="">Select ID</option>
                            <option value={1}>National ID (KTP)</option>
                            <option value={0}>Passport</option>
                          </select>
                          {formErrors[idx].id_gymmaster && <div className="forminfo-error-msg">Member ID is required</div>}
                          {formErrors[idx].id_gymmasterDuplicate && <div className="forminfo-error-msg">Member ID already exists</div>}
                        </div>
                      )}
                    {/* E-KTP Number */}
                    {formDataArray[idx].is_member === 1 ? (
                      <div className={`forminfo-form-group forminfo-ektp-group`}>
                        <label>National ID (KTP) Number</label>
                        <div className="forminfo-ektp-row">
                          <input
                            type="text"
                            maxLength={16}
                            className={`forminfo-ektp-input${formErrors[idx].ktp || formErrors[idx].ktpDuplicate ? " forminfo-error" : ""}`}
                            placeholder="Input your 16 E-KTP Number"
                            value={formDataArray[idx].ktp}
                            onChange={e => handleInputChange(idx, "ktp", e.target.value.replace(/[^0-9]/g, ""))}
                          />
                          <button className="forminfo-ektp-search-btn" onClick={() => getMember(formDataArray[idx].ktp, formDataArray[idx].id_gymmaster, idx)}>
                            {isLoading.getMember ? <div className="forminfo-ektp-search-btn-loading"></div> : <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2"/><path d="M15.5 15.5L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                          </button>
                        </div>
                        {formErrors[idx].ktp && <div className="forminfo-error-msg">E-KTP must be 16 digits</div>}
                        {formErrors[idx].ktpDuplicate && <div className="forminfo-error-msg">E-KTP already exists</div>}
                      </div>
                    ) : (
                      formDataArray[idx].is_member === 0 && formDataArray[idx].is_ktp === 1 ? 
                      <div className={`forminfo-form-group forminfo-ektp-group`}>
                      <label>National ID (KTP) Number</label>
                      <div className="forminfo-ektp-row">
                        <input
                          type="text"
                          maxLength={16}
                          className={`forminfo-ektp-input${formErrors[idx].ktp || formErrors[idx].ktpDuplicate ? " forminfo-error" : ""}`}
                          placeholder="Input your 16 E-KTP Number"
                          value={formDataArray[idx].ktp}
                          disabled={formDataArray[idx].is_ktp === null}
                          onChange={e => handleInputChange(idx, "ktp", e.target.value.replace(/[^0-9]/g, ""))}
                        />
                      </div>
                      {formErrors[idx].ktp && <div className="forminfo-error-msg">E-KTP must be 16 digits</div>}
                      {formErrors[idx].ktpDuplicate && <div className="forminfo-error-msg">E-KTP already exists</div>}
                    </div> : (
                      <div className={`forminfo-form-group forminfo-ektp-group`}>
                        <label>Passport Number</label>
                        <div className="forminfo-ektp-row">
                          <input
                            type="text"
                            maxLength={9}
                            className={`forminfo-ektp-input${formErrors[idx].passpor || formErrors[idx].passporDuplicate ? " forminfo-error" : ""}`}
                            placeholder="e.g., A1234567, M12345678, TR1234567"
                            value={formDataArray[idx].passpor}
                            disabled={formDataArray[idx].is_ktp === null}
                            onChange={e => handleInputChange(idx, "passpor", e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())}
                          />
                        </div>
                        {formErrors[idx].passpor && <div className="forminfo-error-msg">Passport number must be 6-9 characters (letters and numbers only)</div>}
                        {formErrors[idx].passporDuplicate && <div className="forminfo-error-msg">Passport already exists</div>}
                      </div>
                      )
                    )}
                    {/* First Name & Email */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>First Name</label>
                        <input type="text" disabled={formDataArray[idx].is_member === 1} className={`forminfo-input${formErrors[idx].first_name ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].is_member === 0 ? "Input your first name" : ""} value={formDataArray[idx].first_name} onChange={e => handleInputChange(idx, "first_name", e.target.value)} />
                        {formErrors[idx].first_name && <div className="forminfo-error-msg">First Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>E-mail</label>
                        <input type="email" disabled={formDataArray[idx].is_member === 1} className={`forminfo-input${formErrors[idx].email || formErrors[idx].emailDuplicate ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].is_member === 0 ? "Input your email address" : ""} value={formDataArray[idx].email} onChange={e => handleInputChange(idx, "email", e.target.value)} />
                        {formErrors[idx].email && <div className="forminfo-error-msg">Valid email is required</div>}
                        {formErrors[idx].emailDuplicate && <div className="forminfo-error-msg">Email already exists</div>}
                      </div>
                    </div>
                    {/* Last Name & Phone Number */}
                    <div className="forminfo-form-group-row">
                      <div className="forminfo-form-group">
                        <label>Last Name</label>
                        <input type="text" disabled={formDataArray[idx].is_member === 1} className={`forminfo-input${formErrors[idx].last_name ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].is_member === 0 ? "Input your last name" : ""} value={formDataArray[idx].last_name} onChange={e => handleInputChange(idx, "last_name", e.target.value)} />
                        {formErrors[idx].last_name && <div className="forminfo-error-msg">Last Name is required</div>}
                      </div>
                      <div className="forminfo-form-group" style={{ marginTop: '16px' }}>
                        <label>Phone Number</label>
                        <input type="text" disabled={formDataArray[idx].is_member === 1} className={`forminfo-input${formErrors[idx].phone || formErrors[idx].phoneDuplicate ? " forminfo-error" : ""}`} placeholder={formDataArray[idx].is_member === 0 ? "Input your phone number" : ""} value={formDataArray[idx].phone} onChange={e => handleInputChange(idx, "phone", e.target.value.replace(/[^0-9+]/g, ""))} />
                        {formErrors[idx].phone && <div className="forminfo-error-msg">Valid phone number is required</div>}
                        {formErrors[idx].phoneDuplicate && <div className="forminfo-error-msg">Phone number already exists</div>}
                      </div>
                    </div>
                    {/* Instagram (Optional for Non-member users) */}
                    {formDataArray[idx].is_member === 0 && (
                      <div className="forminfo-form-group">
                        <label>Instagram Username <span style={{ color: '#999', fontSize: '12px' }}>(Optional)</span></label>
                        <input 
                          type="text" 
                          className="forminfo-input" 
                          placeholder="e.g., @username or username" 
                          value={formDataArray[idx].instagram} 
                          onChange={e => handleInputChange(idx, "instagram", e.target.value)} 
                        />
                      </div>
                    )}
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

