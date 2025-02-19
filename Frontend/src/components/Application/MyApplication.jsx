import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplication = () => {
  const [application, setApplication] = useState([]); // Default to empty array
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const { user, isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return; // Prevent further rendering of the component
    }
  }, [isAuthorized, navigateTo]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !isAuthorized) return; // Ensure prerequisites

      try {
        const endpoint =
          user.role === "Employer"
            ? "http://localhost:4000/api/application/employer/getall"
            : "http://localhost:4000/api/application/jobseeker/getall";

        const res = await axios.get(endpoint, { withCredentials: true });
        setApplication(res.data.applications || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
        setApplication([]); // Handle empty state
      }
    };

    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized, user]);

  useEffect(() => {
    console.log("Application state updated:", application);
  }, [application]);
  
  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);

      setApplication((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="my_application page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {application.length === 0 ? (
            <h4>No Application Found</h4>
          ) : (
            application.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h3>Applications from Job Seeker</h3>
          {application.length === 0 ? (
            <h4>No Application Found</h4>
          ) : (
            application.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </div>
  );
};

export default MyApplication;

// JobSeekerCard Component
const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span>
          {element.name}
        </p>
        <p>
          <span>Email:</span>
          {element.email}
        </p>
        <p>
          <span>Phone:</span>
          {element.phone}
        </p>
        <p>
          <span>Address:</span>
          {element.address}
        </p>
        <p>
          <span>CoverLetter:</span>
          {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        {element.resume && element.resume.url ? (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        ) : (
          <p>No resume available</p>
        )}
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

// EmployerCard Component
const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span>
          {element.name}
        </p>
        <p>
          <span>Email:</span>
          {element.email}
        </p>
        <p>
          <span>Phone:</span>
          {element.phone}
        </p>
        <p>
          <span>Address:</span>
          {element.address}
        </p>
        <p>
          <span>CoverLetter:</span>
          {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        {element.resume && element.resume.url ? (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        ) : (
          <p>No resume available</p>
        )}
      </div>
    </div>
  );
}; 