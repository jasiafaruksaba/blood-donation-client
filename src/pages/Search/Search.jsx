import { useState, useEffect } from "react";
import axiosPublic from "../../api/axiosPublic";
import { Link } from "react-router";
import { bdDistricts, bdUpazilas } from "../../data/bdLocations";

const Search = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districts] = useState(bdDistricts);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formData, setFormData] = useState({
    blood: "",
    district: "",
    upazila: ""
  });
  const [error, setError] = useState("");

  // Load upazilas when district changes
  useEffect(() => {
    if (selectedDistrict && bdUpazilas[selectedDistrict]) {
      setUpazilas(bdUpazilas[selectedDistrict]);
      setFormData(prev => ({ ...prev, upazila: "" }));
    } else {
      setUpazilas([]);
    }
  }, [selectedDistrict]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "district") {
      setSelectedDistrict(value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDonors([]);

    try {
      const { blood, district, upazila } = formData;
      
      console.log("🔍 Searching:", { blood, district, upazila });

      // Real API Call
      const response = await axiosPublic.get(
        `/users/search?blood=${blood}&district=${district}&upazila=${upazila}`
      );

      console.log("✅ API Response:", response.data);

      const searchResults = Array.isArray(response.data) ? response.data : [];
      setDonors(searchResults);

      if (searchResults.length === 0) {
        setError("No donors found matching your criteria. Try different options.");
      }

    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      
      // Fallback test data
      const fallbackDonors = [
        {
          _id: "fallback1",
          name: `Test Donor 1 (${formData.blood})`,
          email: "test1@example.com",
          bloodGroup: formData.blood,
          district: formData.district,
          upazila: formData.upazila,
          phone: "+8801XXXXXXXXX",
          lastDonation: "2024-03-15"
        },
        {
          _id: "fallback2",
          name: `Test Donor 2 (${formData.blood})`,
          email: "test2@example.com",
          bloodGroup: formData.blood,
          district: formData.district,
          upazila: formData.upazila,
          phone: "+8801XXXXXXXXX",
          lastDonation: "2024-02-20"
        }
      ];
      
      setDonors(fallbackDonors);
      setError("API error occurred. Showing test data for demo.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setFormData({ blood: "", district: "", upazila: "" });
    setSelectedDistrict("");
    setDonors([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/40 to-orange-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-red-600 via-red-700 to-orange-600 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Find Blood Donors
          </h1>
          <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Search nearby blood donors by blood group, district, and upazila. Save lives today!
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-100/50 mb-16">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select 
                name="blood" 
                value={formData.blood} 
                onChange={handleInputChange}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-400/30 focus:border-red-500 bg-white/80 shadow-lg hover:border-red-300 transition-all h-14"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                District <span className="text-red-500">*</span> <span className="text-xs text-slate-500">({districts.length} total)</span>
              </label>
              <select 
                name="district" 
                value={formData.district} 
                onChange={handleInputChange}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-400/30 focus:border-red-500 bg-white/80 shadow-lg hover:border-red-300 transition-all h-14"
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                Upazila <span className="text-red-500">*</span> <span className="text-xs text-slate-500">({upazilas.length} available)</span>
              </label>
              <select 
                name="upazila" 
                value={formData.upazila} 
                onChange={handleInputChange}
                disabled={!selectedDistrict}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-400/30 focus:border-red-500 bg-white/50 disabled:bg-slate-50 disabled:cursor-not-allowed shadow-lg transition-all h-14"
                required
              >
                <option value="">
                  {selectedDistrict 
                    ? `Select Upazila (${upazilas.length} available)` 
                    : "Select District First"
                  }
                </option>
                {upazilas.map(upazila => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button 
              type="submit"
              disabled={loading || !formData.blood || !formData.district || !formData.upazila}
              className="flex-1 max-w-md mx-auto px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed sm:px-16 h-16 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  Searching...
                </>
              ) : (
                <>
                  🔍 <span>Find Donors</span>
                </>
              )}
            </button>
            
            {(formData.blood || formData.district || formData.upazila) && (
              <button 
                type="button"
                onClick={clearSearch}
                className="flex-1 max-w-md mx-auto px-10 py-5 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold text-xl rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 sm:px-16 h-16"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-12 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-xl font-semibold text-yellow-800 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Results */}
        {donors.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                {donors.length}
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                  Donors Found!
                </h2>
                <p className="text-2xl text-emerald-600 font-semibold">
                  {formData.blood} | {formData.district}, {formData.upazila}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {donors.map((donor) => (
                <div 
                  key={donor._id} 
                  className="group bg-white/90 backdrop-blur-xl hover:bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 border border-slate-100/50 hover:border-red-200 overflow-hidden h-full"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-start gap-4 mb-6">
                    <img 
                      src={donor.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=ef4444&color=fff&size=80&bold=true&font-size=0.6`} 
                      alt={donor.name} 
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl object-cover border-4 border-white/80 shadow-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-2xl lg:text-3xl text-slate-900 mb-1 truncate leading-tight">
                        {donor.name}
                      </h3>
                      <p className="text-lg text-slate-600 truncate">{donor.email}</p>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-orange-50/50 rounded-2xl border-2 border-red-100/50">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl flex-shrink-0">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <p className="font-bold text-2xl text-slate-900">{donor.bloodGroup}</p>
                        <p className="text-lg text-slate-600">Blood Group</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-10 p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl border-2 border-emerald-100/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl flex-shrink-0">
                        📍
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xl text-slate-900 truncate">{donor.district}</p>
                        <p className="text-lg text-slate-600 truncate">{donor.upazila}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <Link
                    to={`/donation-requests/${donor._id}`}
                    className="w-full block bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-5 px-8 rounded-3xl text-center shadow-3xl hover:shadow-4xl hover:-translate-y-1 transition-all duration-300 group-hover:scale-[1.02] text-xl flex items-center justify-center gap-3 tracking-wide"
                  >
                    <span className="text-2xl">📞</span>
                    <span>Contact Donor</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {donors.length === 0 && !loading && (formData.blood || formData.district) && (
          <div className="text-center py-32 px-8">
            <div className="w-40 h-40 mx-auto mb-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-black text-slate-500 mb-6">No Donors Found</h3>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              No active donors match your search criteria. Try adjusting your search filters.
            </p>
            <button 
              type="button"
              onClick={clearSearch}
              className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;