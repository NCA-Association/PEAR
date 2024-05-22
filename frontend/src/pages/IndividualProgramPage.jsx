import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { getProgramById } from "../adapters/program-adapter";
import "./IndividualProgramPage.css";
import { getAllProgramComments } from "../adapters/comment-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import MakeComment from "../components/MakeComment";
import Comment from "../components/Comment";
import Recommend from "../components/Recommend";
import { getAllRecommendsOfProgram } from "../adapters/recommend-adapter";

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
        return navigate("/programs");

      const [program] = await getProgramById(id);
      if (program === null) navigate("/programs");
      if (program) setProgramInfo(program);

      const [commentData, error] = await getAllProgramComments(id);
      if (commentData) setComments(commentData);

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
        <div id="p1">
          <img
            id="pr-thumbnail"
            src={programInfo.imgUrl}
            alt={`${programInfo} picture!`}
          />
        </div>
        <div id="rating">
          <h4>Rating:</h4>
          <p>
            {allRecommends.length !== 0
              ? (
                  allRecommends.reduce(
                    (pre, curr) => (curr.recommend ? pre + 1 : pre),
                    0
                  ) / allRecommends.length
                ).toFixed(2) * 100 + "%"
              : "N/A"}
          </p>
        </div>
        <div id="p2">
          <h4>About:</h4>
          <p>{programInfo.bio}</p>
          <br />
          <h4>Location:</h4>
          <p>{programInfo.borough}</p>
          <h4>Website:</h4>
          <a ref={useRef(programInfo.websiteUrl)}>{programInfo.websiteUrl}</a>
        </div>
      </section>

      {currentUser !== null && !isOrganization && currentUser.id !== -1 && (
        <Recommend programId={id} userId={currentUser.id} update={update} />
      )}
      {currentUser !== null && currentUser.id !== -1 && (
        <MakeComment id={+id} setComments={setComments} />
      )}

      <section id="comments">
        <ul>
          {comments?.map((comment, idx) => (
            <Comment
              key={idx}
              comment={comment}
              setComments={setComments}
              update={update}
            />
          ))}
        </ul>
      </section>
    </>
  );
};

export default IndividualProgramPage;
