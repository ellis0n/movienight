import React, { useState, type FormEvent } from "react";
import placeholder from "../assets/placeholdermovie.png?url";
import { actions } from "astro:actions";

type MovieFormData = {
  title: string;
  date: string;
  pickedBy: number;
};

type OmdbMovie = {
  Title: string;
  Year: string;
  Plot: string;
  Director: string;
  Poster: string;
};

type ErrorState = {
  message: string;
};

type Viewer = {
  id: number;
  name: string;
};

type MovieStepperProps = {
  viewers: Viewer[];
};

const MovieStepper: React.FC<MovieStepperProps> = ({ viewers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [pickedBy, setPickedBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState("");
  const [verifiedMovie, setVerifiedMovie] = useState<OmdbMovie | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [typeInput, setTypeInput] = useState<"movie" | "series" | "episode" | "">("movie");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleVerify = async () => {
    if (!title) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await actions.omdb.getOmdbFilm({ 
        title,
        year: yearInput,
        type: typeInput || undefined,
      });
      if (error || !data?.data) {
        setError({ message: "We couldn't find that movie. Try adding a year or checking if it's a TV series." });
        setShowAdvancedSearch(true);
        return;
      }
      setVerifiedMovie(data.data);
      setStep(2);
    } catch (err) {
      setError({ message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getViewers = async () => {
    const { data } = await actions.viewers.getAllViewers();
    console.log(data);
    return data;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!verifiedMovie) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await actions.movies.createMovie({
        title: verifiedMovie.Title,
        pickedBy: Number(pickedBy),
        omdb: verifiedMovie,
        date,
      });

      if (data?.success) {
        setSuccess("Movie added successfully");
        setTimeout(() => {
          resetState();
        }, 1500);
      } else {
        setError({ message: "Failed to add movie" });
        return;
      }
    } catch (err) {
      setError({ message: "Failed to add movie. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsOpen(false);
    setStep(1);
    setTitle("");
    setDate("");
    setPickedBy("");
    setError(null);
    setSuccess("");
    setVerifiedMovie(null);
    setIsLoading(false);
  };

  const ErrorMessage = ({ error }: { error: ErrorState }) => (
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mt-4 flex items-center justify-between">
      <p className="text-red-400">{error.message}</p>
    </div>
  );

  const SuccessMessage = ({ message }: { message: string }) => (
    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mt-4">
      <p className="text-green-400">{message}</p>
    </div>
  );

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full text-left"
          type="button"
        >
          <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
            <span className="text-6xl">+</span>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Add New Movie</h2>
            <p className="text-gray-400">Click to add a new movie</p>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 text-white w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Add New Movie</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      required
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={toggleAccordion}
                    className="w-full text-left p-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Additional Filters</span>
                    <span className={`transform transition-transform ${isAccordionOpen ? 'rotate-180' : 'rotate-0'}`}>
                      ▼
                    </span>
                  </button>
                  {isAccordionOpen && (
                    <div className="space-y-4 mt-2 border-t border-gray-700 pt-4 transition-all duration-300">
                      <div>
                        <label
                          htmlFor="year"
                          className="block text-sm font-medium mb-1"
                        >
                          Year
                        </label>
                        <input
                          type="text"
                          id="year"
                          value={yearInput}
                          onChange={(e) => setYearInput(e.target.value)}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="type"
                          className="block text-sm font-medium mb-1"
                        >
                          Type
                        </label>
                        <select
                          id="type"
                          value={typeInput}
                          onChange={(e) => setTypeInput(e.target.value as "movie" | "series" | "episode")}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        >
                          <option value="movie">Movie</option>
                          <option value="series">Series</option>
                          <option value="episode">Episode</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isLoading || !title}
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify Movie"}
                  </button>
                </div>
              )}

              {step === 2 && verifiedMovie && (
                <>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                      <img
                        src={verifiedMovie.Poster || placeholder}
                        alt="Movie poster"
                        width={300}
                        height={445}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="w-2/3">
                      <h3 className="text-xl font-bold">
                        {verifiedMovie.Title}
                      </h3>
                      <p className="text-gray-300">
                        Year: {verifiedMovie.Year}
                      </p>
                      <p className="text-gray-300 mt-2">{verifiedMovie.Plot}</p>
                      <p className="text-gray-300 mt-2">
                        Director: {verifiedMovie.Director}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium mb-1"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pickedBy"
                        className="block text-sm font-medium mb-1"
                      >
                        Picked By
                      </label>
                      <select
                        id="pickedBy"
                        value={pickedBy}
                        onChange={(e) => setPickedBy(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                      >
                        <option value="">Select a viewer</option>
                        {viewers.map((viewer) => (
                          <option key={viewer.id} value={viewer.id}>
                            {viewer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {error && <ErrorMessage error={error} />}
              {success && <SuccessMessage message={success} />}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {setStep(1), setTitle(""), setVerifiedMovie(null)}}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => resetState()}
                  type="button"
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                {step === 2 && (
                  <button
                    type="submit"
                    disabled={isLoading || !date || !pickedBy}
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Adding..." : "Add Movie"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieStepper;
