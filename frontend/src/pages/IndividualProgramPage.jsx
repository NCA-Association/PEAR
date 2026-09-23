import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { getProgramById } from "../adapters/program-adapter";
import { getAllProgramComments } from "../adapters/comment-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import MakeComment from "../components/MakeComment";
import Comment from "../components/Comment";
import Recommend from "../components/Recommend";
import { getAllRecommendsOfProgram } from "../adapters/recommend-adapter";
import "./IndividualProgramPage.css";

const IndividualProgramPage = () => {
  const { currentUser, isOrganization } = useContext(CurrentUserContext);
  const { id } = useParams();
  const [programInfo, setProgramInfo] = useState([]);
  const [comments, setComments] = useState([]);

  const [rating, setRating] = useState(null);
  const [allRecommends, setAllRecommends] = useState([]);

  const navigate = useNavigate();

  const update = async () => {
    setComments((await getAllProgramComments(id))[0]);
    const recommends = await getAllRecommendsOfProgram(id);
    setAllRecommends(recommends);
  };

  useEffect(() => {
    const getProgramInfo = async () => {
      if (Number.isNaN(+id) || typeof +id === "string")
        return navigate("/opportunities");

      const [program] = await getProgramById(id);
      if (program === null) navigate("/opportunities");
      if (program) setProgramInfo(program);

      const [commentData, error] = await getAllProgramComments(id);
      if (commentData) setComments(commentData);

      if (!program) return;
      const recommends = await getAllRecommendsOfProgram(program.id);
      setAllRecommends(recommends);
      if (allRecommends.length !== 0) {
        const yesAmount = allRecommends.reduce(
          (pre, curr) => (curr.recommend ? ++pre : pre),
          0
        );
        setRating(`${(yesAmount / recommends.length).toFixed(2) * 100}%`);
      }
    };

    getProgramInfo();
  }, [id, navigate]);

  return (
    <>
      <section id="info">
        <h2 id="program-title">{programInfo.name}</h2>
        <div id="tp">
          <div id="p1">
            <img
              id="pr-thumbnail"
              src={programInfo.imgUrl}
              alt={`${programInfo} picture!`}
            />
          </div>
          <div id="p2">
            <div className="prgInfoAbt">
              <h4 id="about-text" className="normal-font">
                About:
              </h4>
              <p className="normal-font">{programInfo.bio}</p>
            </div>
            <div id="program-info">
              <div className="prgmInfoSameLine normal-font">
                <h4>Location:</h4>
                <p className="normal-font">{programInfo.borough}</p>
              </div>
              <div className="prgmInfoSameLine normal-font">
                <h4>Website:</h4>
                <a
                  className="normal-font"
                  target="_blank"
                  rel="noreferrer"
                  href={programInfo.websiteUrl}
                >
                  {programInfo.websiteUrl}
                </a>
              </div>
              <div id="rating" className="prgmInfoSameLine">
                <h4>Rating:</h4>
                <p>
                  {allRecommends.length !== 0
                    ? (
                        allRecommends?.reduce(
                          (pre, curr) => (curr.recommend ? pre + 1 : pre),
                          0
                        ) / allRecommends.length
                      ).toFixed(2) *
                        100 +
                      "%"
                    : "N/A"}
                </p>
              </div>
            </div>
            {currentUser !== null &&
              !isOrganization &&
              currentUser.id !== -1 && (
                <div id="do-recommend">
                  <Recommend
                    programId={id}
                    userId={currentUser.id}
                    update={update}
                  />
                </div>
              )}
          </div>
        </div>
      </section>
      <section id="comments">
        <h2>Comments:</h2>
        {currentUser !== null && !isOrganization && currentUser.id !== -1 && (
          <MakeComment id={programInfo.id} setComments={setComments} />
        )}
        <div id="all-comments">
          {comments?.map((comment, idx) => (
            <Comment
              key={idx}
              comment={comment}
              setComments={setComments}
              update={update}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default IndividualProgramPage;
