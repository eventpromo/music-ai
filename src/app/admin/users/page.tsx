import { sunoUserService } from "@/lib/services";
import Section from "../../components/Section";
import { SunoUserStatus } from "@/lib/models/SunoUser";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function AdminUsers() {
  const data = await sunoUserService.getSunoUsers();

  return (
    <Section className="my-10 flex flex-col w-full gap-4">
      <article className="prose lg:prose-lg max-w-4xl" >
        <h1 className="text-xl text-indigo-900 text-center flex">Suno Users: </h1>
        <h3 className="text-md m-0 text-indigo-900">Create User: </h3>
        <div className="flex flex-col gap-2 border p-4">
          <div>
            <strong>User Id: </strong>
            <input type="text" className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight" />
          </div>
          <div>
            <strong>Status: </strong>
            <select className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight">
              <option
                value={SunoUserStatus.Active}>
                {SunoUserStatus.Active}
              </option>
              <option
                value={SunoUserStatus.Blocked}>
                {SunoUserStatus.Blocked}
              </option>
            </select>
          </div>
          <div>
            <strong>Cookie: </strong>
            <textarea
              className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
              rows={6}
              cols={60}></textarea>
          </div>
          <div>
            <strong>Credits: </strong>
            <input type="number" className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"/>
          </div>
          <div>
            <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline text-white font-bold py-2 px-4 rounded">
              Create User
            </button>
          </div>
        </div>
        <h3 className="text-md m-0 text-indigo-900">Update Users: </h3>
        <div className="flex flex-col w-full gap-3">
          {data.map((user) => (
            <div key={user.id} className="flex flex-col gap-2 border p-4">
              <div>
                <strong>User Id: </strong> {user.id}
              </div>
              <div>
                <strong>Status: </strong>
                {user.status === SunoUserStatus.Blocked
                  ? <span className="bg-red-100 border border-red-400 text-red-700 p-1">{user.status}</span>
                  : <span className="bg-green-100 border border-green-400 text-green-700 p-1">{user.status}</span>}     
              </div>
              <div>
                <strong>Cookie: </strong>
                <textarea
                  className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
                  rows={6}
                  cols={60}
                  value={user.cookie}>                    
                  </textarea>
              </div>
              <div>
                <strong>Credits Left: </strong>
                {user.creditsLeft}
              </div>
              <div>
                <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline text-white font-bold py-2 px-4 rounded">
                  Save changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </Section>
  );
}, { returnTo: '/' });