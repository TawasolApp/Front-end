import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { axiosInstance as axios } from "../../../../apis/axios";
import { useNavigate } from "react-router-dom";

function CreateCompanyPage() {
  const [companyName, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgType, setOrgType] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return; // Stop submission if there are validation errors
    }

    setLoading(true);

    // Prepare company data for API request
    const newCompany = {
      companyId: companyName.toLowerCase(),
      name: companyName,
      industry: industry,
      companySize: orgSize,
      companyType: orgType,
      description: `${companyName} is a leading company in the ${industry} sector.`,
    };

    try {
      // Send POST request to create company
      const response = await axios.post("/companies", newCompany);

      if (response.status === 201) {
        setSuccessMessage("Company page created successfully!");
        setTimeout(() => {
          navigate(`/company/${newCompany.companyId}/home`);
        }, 2000);
      }
    } catch (error) {
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

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-6 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Form Section */}
          <div className="space-y-4 bg-boxbackground p-6 rounded-xl border border-gray-300 shadow-md">
            {/* Name */}
            <div>
              <label className="block text-sm text-text2 mb-1">Name*</label>
              <input
                type="text"
                value={companyName}
                id="company-name"
                data-testid="company-name"
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-1 border text-sm bg-boxbackground border-gray-400 rounded-md text-text2 ${
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

            {/* Website */}
            <div>
              <label className="block text-sm text-text2 mb-1">Website</label>
              <input
                type="url"
                id="company-website"
                data-testid="company-website"
                className="w-full p-1 border text-sm border-gray-400 rounded-md bg-boxbackground text-text2"
                placeholder="Begin with http://, https:// or www."
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm text-text2 mb-1">Industry*</label>
              <input
                type="text"
                id="company-industry"
                data-testid="company-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={`w-full p-1 border text-sm border-gray-400 rounded-md bg-boxbackground text-text2 ${
                  errors.industry ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="ex: Information Services"
              />
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>

            {/* Organization Size */}
            <div>
              <label className="block text-sm text-text2 mb-1">
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
                <option>0-1 employees</option>
                <option>2-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-500 employees</option>
                <option>501-1,000 employees</option>
                <option>1,001-5,000 employees</option>
                <option>5,001-10,000 employees</option>
                <option>10,000+ employees</option>
              </select>
              {errors.orgSize && (
                <p className="text-red-500 text-xs mt-1">{errors.orgSize}</p>
              )}
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm text-text2 mb-1">
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
                <option>Public company</option>
                <option>Self-employed</option>
                <option>Government agency</option>
                <option>Nonprofit</option>
                <option>Sole proprietorship</option>
                <option>Privately held</option>
                <option>Partnership</option>
              </select>
              {errors.orgType && (
                <p className="text-red-500 text-xs mt-1">{errors.orgType}</p>
              )}
            </div>
            {/* Logo Upload */}
            <div>
              <label className="block text-sm text-text2 mb-1">Logo</label>
              <div className="w-full min-h-[100px] border border-gray-400 rounded-md bg-uploadimage relative flex flex-col items-center justify-center px-4 py-6 text-center">
                <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
                  <FiUpload className="text-2xl font-semibold text-text2" />
                  <p className="font-semibold text-sm text-text2">
                    Choose file
                  </p>
                  <p className="text-text2 text-xs">Upload to see preview</p>
                </div>
                <input
                  type="file"
                  id="company-logo"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                300 x 300px recommended. JPGs, JPEGs, and PNGs supported.
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm text-text2 mb-1">Tagline</label>
              <textarea
                value={tagline}
                id="company-tagline"
                data-testid="company-tagline"
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2 border rounded-md bg-boxbackground text-text2"
                placeholder="ex: An information services firm helping small businesses succeed."
                maxLength={120}
              />
              <p className="text-xs text-gray-500">
                Use your tagline to briefly describe what your organization
                does. This can be changed later.
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

            {/* Terms Link */}
            <p className="text-blue-600 cursor-pointer hover:underline font-medium text-sm">
              Read the LinkedIn Pages Terms
            </p>
          </div>

          {/* Right Page Preview */}
          <div className="bg-background">
            <div className="bg-boxbackground p-6 rounded-xl border border-gray-300 shadow-md h-auto pt-2 px-0 pb-0">
              <h3 className="text-lg font-semibold text-text mb-2 pl-2">
                Page preview
              </h3>
              <div className="bg-background w-full p-6 rounded-b-xl">
                <div className="mt-4 bg-boxbackground pt-4 pb-4 rounded-xl px-6">
                  <div className="h-32 w-32 bg-gray-200 mx-auto rounded-full mb-4"></div>
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
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
          {errors.apiError && (
            <p className="text-red-600 mt-2">{errors.apiError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
