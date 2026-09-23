import { fetchHandler, getPatchOptions, getPostOptions } from "../utils";

const baseUrl = '/api/organizations';

export const createOrganization = async ({username, password, pfp_url}) => (
  await fetchHandler(baseUrl, getPostOptions({username,password,pfp_url}))
);

export const getAllOrganizations = async () => {
  const [organizations] = await fetchHandler(baseUrl);
  console.log(organizations);
  return organizations || [];
}

export const getOrganization = async (id) => await fetchHandler(`${baseUrl}/${id}`);


export const updateOrganization = async ({id, username, password, pfp_url}) => {
  return await fetchHandler(`${baseUrl}/${id}`, getPatchOptions({username, password,pfp_url}))
};

export const getPrograms = async (id) => await fetchHandler(`${baseUrl}/programs/${id}`);
