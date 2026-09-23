import { fetchHandler, getPatchOptions, getPostOptions } from "../utils";

const baseUrl = '/api/recommends';

export const createRecommend = async ({programId,userId, recommend}) => fetchHandler(baseUrl, getPostOptions({program_id:programId, user_id:userId, recommend}))

export const getAllRecommends = async () => {
  const [recommends] = await fetchHandler(baseUrl);
  return recommends || [];
}

export const getAllRecommendsOfProgram = async (id) => {
  const [recommends] = await fetchHandler(`/api/programs/recommends/${id}`);
  return recommends || [];
};

export const getAllRecommendsOfUser = async (id) => {
  const recommends = await fetchHandler(`/api/users/recommends/${id}`);
  return recommends || [];
}

export const doesRecommendExist = async (programId, userId) =>
  await fetchHandler(`${baseUrl}/check?program=${programId}&user=${userId}`);

export const updateRecommend = async(recommendId,recommend) => await fetchHandler(`${baseUrl}/${recommendId}`,getPatchOptions({recommend}));
