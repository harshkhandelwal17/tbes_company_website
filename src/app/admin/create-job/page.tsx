"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    qualifications: "",
    responsibilities: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setFormData({
        title: "",
        location: "",
        type: "",
        description: "",
        qualifications: "",
        responsibilities: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create Job Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="type">Job Type (e.g., Full-time, Part-time)</Label>
          <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="qualifications">Qualifications</Label>
          <Textarea id="qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities</Label>
          <Textarea id="responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} required />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </Button>

        {success && <p className="text-green-500 mt-2">Job created successfully!</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
