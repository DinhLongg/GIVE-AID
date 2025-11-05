import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import donationService from "../services/donationServices";
import programService from "../services/programServices";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DonatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    programId: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit",
    anonymous: false,
    newsletter: true,
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await programService.getAll();
        setPrograms(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        setPrograms([]);
      }
    };
    fetchPrograms();
  }, []);

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "amount" || name === "customAmount") {
      setFormData((prev) => ({ ...prev, amount: value }));
      return;
    }
    
    if (name === "category" || name === "programId") {
      setFormData((prev) => ({ ...prev, programId: value }));
      return;
    }

    // Handle checkboxes
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // Handle radio buttons
    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // các field khác
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warn("Please login to donate!");
      navigate("/login");
      return;
    }

    // Validate form
    if (!formData.programId || !formData.amount) {
      toast.error("Please choose program and amount");
      return;
    }

    const amount = Number(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    if (!formData.fullName || !formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Find program title from programId (move outside try block for error logging)
    const selectedProgram = programs.find((p) => p.id === Number(formData.programId));
    const causeName = selectedProgram?.title || "General Donation";
    
    if (!causeName || causeName.trim() === "") {
      toast.error("Please select a valid program");
      setIsSubmitting(false);
      return;
    }

    // Prepare request payload
    const requestPayload = {
      userId: user.id,
      amount: amount,
      cause: causeName.trim(),
      programId: formData.programId ? Number(formData.programId) : undefined, // Link to program if selected
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      paymentMethod: formData.paymentMethod === "credit" ? "Card" : "Card",
      anonymous: formData.anonymous || false,
      newsletter: formData.newsletter || false,
    };

    try {
      await donationService.create(requestPayload);

      toast.success("Thank you for your donation! ❤️");
      setFormData({
        amount: "",
        programId: "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: "",
        address: "",
        paymentMethod: "credit",
        anonymous: false,
        newsletter: true,
      });
    } catch (err) {
      console.error("Donation error:", err);
      console.error("Error response:", err?.response?.data);
      console.error("Request payload:", requestPayload);
      
      // Handle validation errors
      if (err?.response?.status === 400) {
        const errorData = err.response?.data;
        console.error("Error details:", errorData);
        
        if (errorData?.errors) {
          // Multiple validation errors
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("\n");
          toast.error(`Validation failed:\n${errorMessages}`, { autoClose: 5000 });
        } else {
          // Single error message
          toast.error(errorData?.message || "Invalid donation data. Please check your information.");
        }
      } else {
        toast.error(err?.response?.data?.message || "Donation failed! Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-5 bg-primary text-white"
        style={{ marginTop: "80px" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">
                Donate for a Better Future
              </h1>
              <p className="lead mb-0">
                Every donation you make will create a difference in the lives of
                those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Categories */}
      <section id="categories" className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">
                Choose the Program You Want to Support
              </h2>
              <p className="lead text-muted">
                All donations are used transparently and effectively.
              </p>
            </div>
          </div>

          <div className="row">
            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="category-card h-100" data-category="education">
                <div className="category-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h5 className="category-title">Children Education</h5>
                <p className="category-description">
                  Supporting school fees, books, and learning materials for
                  children in difficult circumstances.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$15,000</span>
                  <span className="progress-text">75% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="category-card h-100" data-category="healthcare">
                <div className="category-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h5 className="category-title">Healthcare Support</h5>
                <p className="category-description">
                  Providing free medical services and medicines for the poor and
                  disabled.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$12,000</span>
                  <span className="progress-text">60% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="category-card h-100" data-category="women">
                <div className="category-icon">
                  <i className="fas fa-female"></i>
                </div>
                <h5 className="category-title">Women Empowerment</h5>
                <p className="category-description">
                  Supporting women in developing professional skills and
                  starting businesses.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$9,000</span>
                  <span className="progress-text">45% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="category-card h-100" data-category="children">
                <div className="category-icon">
                  <i className="fas fa-child"></i>
                </div>
                <h5 className="category-title">Child Protection</h5>
                <p className="category-description">
                  Protecting and caring for children in particularly difficult
                  circumstances.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$8,500</span>
                  <span className="progress-text">42% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="category-card h-100" data-category="elderly">
                <div className="category-icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h5 className="category-title">Elderly Care</h5>
                <p className="category-description">
                  Supporting healthcare and daily activities for lonely elderly
                  people.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$6,000</span>
                  <span className="progress-text">30% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="category-card h-100" data-category="disabled">
                <div className="category-icon">
                  <i className="fas fa-wheelchair"></i>
                </div>
                <h5 className="category-title">Disability Support</h5>
                <p className="category-description">
                  Providing assistive devices and vocational training for people
                  with disabilities.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$5,500</span>
                  <span className="progress-text">28% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: "28%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="donation-form-container" data-aos="fade-up">
                <div className="form-header text-center mb-4">
                  <h3 className="fw-bold mb-3">Donation Information</h3>
                  <p className="text-muted">
                    Please fill in all information to complete your donation
                  </p>
                </div>
                <form
                  id="donationForm"
                  className="donation-form"
                  onSubmit={handleDonate}
                >
                  {/* Donation Amount */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Donation Amount</h5>
                    <div className="amount-options">
                      <div className="row">
                        <div className="col-md-3 col-6 mb-3">
                          <input
                            type="radio"
                            name="amount"
                            value="50"
                            id="amount-50"
                            className="amount-radio"
                            onChange={handleChange}
                            checked={formData.amount === "50"}
                          />
                          <label htmlFor="amount-50" className="amount-option">
                            <span className="amount">$50</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input
                            type="radio"
                            name="amount"
                            value="100"
                            id="amount-100"
                            className="amount-radio"
                            onChange={handleChange}
                            checked={formData.amount === "100"}
                          />
                          <label htmlFor="amount-100" className="amount-option">
                            <span className="amount">$100</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input
                            type="radio"
                            name="amount"
                            value="200"
                            id="amount-200"
                            className="amount-radio"
                            onChange={handleChange}
                            checked={formData.amount === "200"}
                          />
                          <label htmlFor="amount-200" className="amount-option">
                            <span className="amount">$200</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input
                            type="radio"
                            name="amount"
                            value="500"
                            id="amount-500"
                            className="amount-radio"
                            onChange={handleChange}
                            checked={formData.amount === "500"}
                          />
                          <label htmlFor="amount-500" className="amount-option">
                            <span className="amount">$500</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                      </div>
                      <div className="custom-amount mt-3">
                        <div className="input-group">
                          <span className="input-group-text">USD</span>
                          <input
                            type="number"
                            name="customAmount"
                            id="customAmount"
                            className="form-control"
                            placeholder="Enter other amount"
                            min="10"
                            value={
                              formData.amount &&
                              !["50", "100", "200", "500"].includes(
                                formData.amount
                              )
                                ? formData.amount
                                : ""
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Choose Program</h5>
                    <select
                      name="category"
                      id="category"
                      className="form-select"
                      required
                      value={formData.programId}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Program --</option>

                      {/* nếu có programs từ backend -> render */}
                      {programs.length > 0 ? (
                        programs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))
                      ) : (
                        <>
                          {/*giữ option tĩnh nếu backend không trả về */}
                          <option value="education">Children Education</option>
                          <option value="healthcare">Healthcare Support</option>
                          <option value="women">Women Empowerment</option>
                          <option value="children">Child Protection</option>
                          <option value="elderly">Elderly Care</option>
                          <option value="disabled">Disability Support</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Personal Information */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Personal Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="fullName" className="form-label">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          className="form-control"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="form-control"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Payment Information</h5>
                    <div className="payment-methods mb-3">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="creditCard"
                          value="credit"
                          checked={formData.paymentMethod === "credit"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="creditCard"
                        >
                          <i className="fas fa-credit-card me-2"></i>Credit Card
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="debitCard"
                          value="debit"
                          checked={formData.paymentMethod === "debit"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="debitCard">
                          <i className="fas fa-credit-card me-2"></i>Debit Card
                        </label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="cardNumber" className="form-label">
                          Card Number *
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                          />
                          <span className="input-group-text card-type-icon">
                            <i className="fas fa-credit-card text-muted"></i>
                          </span>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="expiryMonth" className="form-label">
                          Expiry Month *
                        </label>
                        <select
                          name="expiryMonth"
                          id="expiryMonth"
                          className="form-select"
                          required
                        >
                          <option value="">Month</option>
                          <option value="01">01</option>
                          <option value="02">02</option>
                          <option value="03">03</option>
                          <option value="04">04</option>
                          <option value="05">05</option>
                          <option value="06">06</option>
                          <option value="07">07</option>
                          <option value="08">08</option>
                          <option value="09">09</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="expiryYear" className="form-label">
                          Expiry Year *
                        </label>
                        <select
                          name="expiryYear"
                          id="expiryYear"
                          className="form-select"
                          required
                        >
                          <option value="">Year</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030">2030</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="cvv" className="form-label">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          className="form-control"
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="saveCard"
                        id="saveCard"
                      />
                      <label className="form-check-label" htmlFor="saveCard">
                        Save card information for faster donations next time
                      </label>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Additional Options</h5>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="anonymous"
                        id="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="anonymous">
                        Anonymous donation
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="newsletter"
                        id="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="newsletter">
                        Receive email updates about programs
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="inviteFriends"
                        id="inviteFriends"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inviteFriends"
                      >
                        Send email invitation to friends
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-section text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-heart me-2"></i>
                      {isSubmitting ? "Processing..." : "Donate Now"}
                    </button>
                    <p className="text-muted mt-3 small">
                      <i className="fas fa-lock me-1"></i>
                      Payment information is encrypted and secure
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
