import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

      {/* Banner */}
      <div className="bg-red-100 py-20 text-center">
        <h1 className="text-4xl font-bold">
          Donate Blood, Save Life ❤️
        </h1>

        <div className="mt-5 space-x-3">
          <Link to="/register" className="btn btn-primary">
            Join as Donor
          </Link>

          <Link to="/search" className="btn">
            Search Donors
          </Link>
        </div>
      </div>

      {/* Featured */}
      <div className="py-10 text-center">
        <h2 className="text-2xl font-bold mb-5">
          Why Donate Blood?
        </h2>

        <div className="grid md:grid-cols-3 gap-5 px-5">
          <div className="p-5 bg-white shadow">Save Lives</div>
          <div className="p-5 bg-white shadow">Community Help</div>
          <div className="p-5 bg-white shadow">Be a Hero</div>
        </div>
      </div>

    </div>
  );
};

export default Home;