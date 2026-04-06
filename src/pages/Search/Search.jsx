import { useState } from "react";
import axiosPublic from "../../api/axiosPublic";

const Search = () => {
  const [donors, setDonors] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const form = e.target;

    const blood = form.blood.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    const res = await axiosPublic.get(
      `/users/search?blood=${blood}&district=${district}&upazila=${upazila}`
    );

    setDonors(res.data);
  };

  return (
    <div className="p-5">

      <form onSubmit={handleSearch} className="space-x-2">

        <input name="blood" placeholder="Blood Group" className="input" />
        <input name="district" placeholder="District" className="input" />
        <input name="upazila" placeholder="Upazila" className="input" />

        <button className="btn btn-primary">Search</button>
      </form>

      <div className="mt-5 grid md:grid-cols-3 gap-5">
        {donors.map((d) => (
          <div key={d._id} className="p-4 shadow bg-white">
            <p>{d.name}</p>
            <p>{d.bloodGroup}</p>
            <p>{d.district}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Search;