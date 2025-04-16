import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { axiosInstance as axios } from "../../../../apis/axios";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../LoadingScreen/LoadingPage";

function CreateCompanyPage() {
  const [companyName, setName] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgType, setOrgType] = useState("");
  const [overview, setOverview] = useState("");
  const [founded, setFounded] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    let newErrors = {};
    if (!companyName.trim()) newErrors.companyName = "Please enter a name.";
    if (!industry.trim()) newErrors.industry = "Please select an industry.";
    if (!orgSize.trim())
      newErrors.orgSize = "Please select an organization size.";
    if (!orgType.trim())
      newErrors.orgType = "Please select an organization type.";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";
    // Email validation (required and must be in correct format)
    if (!email.trim()) {
      newErrors.email = "Please enter an email address.";
    }
    if (!website.trim()) {
      newErrors.website = "Please enter the company website.";
    }
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Please enter a contact number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLogoUploading(true);

    try {
      const uploadResponse = await axios.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadResponse.data.url;

      setLogoPreview(fileUrl);
      setLogoFile(file);
      setErrors((prev) => {
        const { logo, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors((prev) => ({
        ...prev,
        apiError: "Failed to upload logo. Please try again.",
      }));
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setLoading(true);

    const newCompany = {
      name: companyName,
      companySize: orgSize,
      companyType: orgType,
      industry,
      website,
      email,
      contactNumber,
    };
    if (overview.trim()) newCompany.overview = overview.trim();
    if (tagline.trim()) newCompany.description = tagline.trim();
    if (address.trim()) newCompany.address = address.trim();

    // Valid founded year (number + reasonable range)
    const parsedFounded = parseInt(founded);
    if (
      !isNaN(parsedFounded) &&
      parsedFounded >= 1800 &&
      parsedFounded <= new Date().getFullYear()
    ) {
      newCompany.founded = parsedFounded;
    }

    // Valid URL for location
    const locationPattern =
      /^https:\/\/(www\.)?google\.com\/maps\?q=([-+]?[\d.]+),([-+]?[\d.]+)$/;
    if (location.trim()) {
      if (!locationPattern.test(location.trim())) {
        setErrors((prev) => ({
          ...prev,
          location:
            "Location must be a valid Google Maps link (e.g., https://www.google.com/maps?q=89.6833,27.6897).",
        }));
        setLoading(false);
        return;
      } else {
        newCompany.location = location.trim();
      }
    }

    if (logoUploading) {
      setErrors((prev) => ({
        ...prev,
        logo: "Please wait for the logo to finish uploading.",
      }));
      setLoading(false);
      return;
    }

    if (logoPreview && /^https?:\/\/.+/.test(logoPreview)) {
      newCompany.logo = logoPreview;
    }

    console.log("Request Body:", newCompany);
    try {
      const response = await axios.post("/companies", newCompany);
      console.log("Response Body:", response.data);
      if (response.status === 201) {
        const createdCompany = response.data;
        setRedirecting(true); // prevent re-render
        navigate(`/company/${createdCompany.companyId}/home`);
      }
    } catch (error) {
      console.error(
        "Full error response:",
        error.response?.data || error.message,
      );
      if (error.response) {
        setErrors((prev) => ({
          ...prev,
          apiError: error.response.data.error || "Something went wrong.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          apiError: "Server error. Please try again later.",
        }));
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading || redirecting) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-6 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Form Section */}
          <div className="space-y-4 bg-boxbackground p-6 rounded-xl border border-gray-300 shadow-md">
            {/* Name */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Name*
              </label>
              <input
                type="text"
                value={companyName}
                id="company-name"
                data-testid="company-name"
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-1 border text-sm bg-boxbackground border-gray-400 rounded-md text-normaltext ${
                  errors.companyName ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="Add your organization’s name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Tagline
              </label>
              <textarea
                value={tagline}
                id="company-tagline"
                data-testid="company-tagline"
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
                placeholder="ex: An information services firm helping small businesses succeed."
                maxLength={120}
              />
              <p className="text-xs text-gray-500">
                Use your tagline to briefly describe what your organization
                does. This can be changed later.
              </p>
            </div>
            {/* Organization Size */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Organization size*
              </label>
              <select
                value={orgSize}
                id="organization-size"
                data-testid="organization-size"
                onChange={(e) => setOrgSize(e.target.value)}
                className={`w-full bg-boxbackground text-text p-1 border text-sm
                border-gray-400 rounded-md ${
                  errors.orgSize ? "border-red-500" : "border-gray-400"
                }`}
              >
                <option value="">Select size</option>
                <option data-testid="1-50Emp">1-50 Employees</option>
                <option>51-400 Employees</option>
                <option>401-1000 Employees</option>
                <option>1001-10000 Employees</option>
                <option>10000+ Employees</option>
              </select>
              {errors.orgSize && (
                <p className="text-red-500 text-xs mt-1">{errors.orgSize}</p>
              )}
            </div>
            {/* Organization Type */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Organization type*
              </label>
              <select
                value={orgType}
                id="organization-type"
                data-testid="organization-type"
                onChange={(e) => setOrgType(e.target.value)}
                className={`w-full bg-boxbackground p-1 border text-text text-sm border-gray-400
                rounded-md ${
                  errors.orgType ? "border-red-500" : "border-gray-400"
                }`}
              >
                <option value="">Select type</option>
                <option data-testid="PublicCompany">Public Company</option>
                <option>Self Employed</option>
                <option>Government Agency</option>
                <option>Non Profit</option>
                <option>Sole Proprietorship</option>
                <option>Privately Held</option>
                <option>Partnership</option>
              </select>
              {errors.orgType && (
                <p className="text-red-500 text-xs mt-1">{errors.orgType}</p>
              )}
            </div>
            {/* Industry */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Industry*
              </label>
              <input
                type="text"
                id="company-industry"
                data-testid="company-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={`w-full p-1 border text-sm border-gray-400 rounded-md bg-boxbackground text-normaltext ${
                  errors.industry ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="ex: Information Services"
              />
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>
            {/* Overview */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Overview
              </label>
              <textarea
                id="company-overview"
                value={overview}
                data-testid="company-overview"
                onChange={(e) => setOverview(e.target.value)}
                className="w-full p-2 border rounded-md bg-boxbackground text-normaltext"
                placeholder="Brief description of your company"
              />
            </div>

            {/* Founded */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Founded Year
              </label>
              <input
                id="company-founded"
                type="number"
                value={founded}
                data-testid="company-founded"
                onChange={(e) => setFounded(e.target.value)}
                className="w-full p-1 border text-sm rounded-md bg-boxbackground text-normaltext"
                placeholder="e.g., 1999"
              />
            </div>
            {/* Website */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Website*
              </label>
              <input
                type="url"
                value={website}
                id="company-website"
                data-testid="company-website"
                onChange={(e) => setWebsite(e.target.value)}
                className={`w-full p-1 border text-sm border-gray-400 rounded-md bg-boxbackground text-normaltext ${
                  errors.website ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="Begin with http://, https:// or www."
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                id="company-address"
                data-testid="company-address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-1 border text-sm rounded-md bg-boxbackground text-normaltext"
                placeholder="123 Example Street"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                id="company-location"
                data-testid="company-location"
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-1 border text-sm rounded-md bg-boxbackground text-normaltext"
                placeholder="Google maps location"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Email*
              </label>
              <input
                type="email"
                value={email}
                id="company-email"
                data-testid="company-email"
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-1 border text-sm rounded-md bg-boxbackground text-normaltext ${
                  errors.email ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="example@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm text-normaltext mb-1">
                Contact Number*
              </label>
              <input
                type="tel"
                value={contactNumber}
                id="company-contactNumber"
                data-testid="company-contactNumber"
                onChange={(e) => setContactNumber(e.target.value)}
                className={`w-full p-1 border text-sm rounded-md bg-boxbackground text-normaltext ${
                  errors.contactNumber ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="+20 123 456 7890"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label
                className="block text-sm text-normaltext mb-1"
                htmlFor="company-logo"
              >
                Logo
              </label>
              <div
                data-testid="company-logo"
                className="w-full min-h-[100px] border border-gray-400 rounded-md bg-uploadimage relative flex flex-col items-center justify-center px-4 py-6 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                  <FiUpload className="text-2xl font-semibold text-normaltext" />
                  <p className="font-semibold text-sm text-normaltext">
                    Choose file
                  </p>
                  <p className="text-normaltext text-xs">
                    Upload to see preview
                  </p>
                </div>

                <input
                  type="file"
                  id="company-logo"
                  data-testid="company-logo-add"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleLogoUpload}
                />
              </div>
              {logoUploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading logo...</p>
              )}
              {errors.logo && (
                <p
                  className="text-red-500 text-xs mt-1"
                  data-testid="logo-error"
                >
                  {errors.logo}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1">
                300 x 300px recommended. JPGs, JPEGs, and PNGs supported.
              </p>
            </div>

            {/* Verification Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                data-testid="agree-terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
              />
              <p className="text-sm text-text">
                I verify that I am an authorized representative of this
                organization and have the right to act on its behalf in the
                creation and management of this page. The organization and I
                agree to the additional terms for Pages.
              </p>
            </div>
            {errors.agreeTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Right Page Preview */}
          <div className="bg-background">
            <div className="bg-boxbackground p-6 rounded-xl border border-gray-300 shadow-md h-auto pt-2 px-0 pb-0">
              <h3 className="text-lg font-semibold text-text mb-2 pl-2">
                Page preview
              </h3>
              <div className="bg-background w-full p-6 rounded-b-xl">
                <div className="mt-4 bg-boxbackground pt-4 pb-4 rounded-xl px-6">
                  <div className="h-32 w-32 mx-auto rounded-full mb-4 overflow-hidden border border-gray-300 bg-white flex items-center justify-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        Logo Preview
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-text">
                    {companyName || "Company Name"}
                  </h4>
                  <p className="text-sm text-text font-medium">
                    {tagline || "Tagline"}
                  </p>
                  <p className="text-sm text-gray-500 text-overviewcomponenttext">
                    {industry || "Industry"}
                  </p>
                  <button className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold">
                    + Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex mt-6">
          <button
            data-testid="create-page-button"
            onClick={handleSubmit}
            disabled={!agreeTerms}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              !agreeTerms
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            Create Page
          </button>
          {/* Success or Error Message */}
          {successMessage && (
            <p className="text-green-600 mt-2" data-testid="success-message">
              {successMessage}
            </p>
          )}
          {errors.apiError && (
            <p className="text-red-600 mt-2" data-testid="api-error-message">
              {errors.apiError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
