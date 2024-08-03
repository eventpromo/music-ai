"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import Section from "../Section";
import SunoUser, { SunoUserStatus } from "@/lib/models/SunoUser";

type SunoUserMap = {
  [userId: string]: SunoUser;
};

type SunoUserError = Partial<Record<keyof SunoUser, string>>;

const AdminUsers = ({ initialUsers }: { initialUsers: SunoUser[] }) => {
  const [sunoUsers, setSunoUsers] = useState<SunoUser[]>(initialUsers);
  const [createFormValues, setCreateFormValues] = useState({
    id: '',
    status: SunoUserStatus.Active,
    cookie: '',
    creditsLeft: 0
  });
  const [updateFormValues, setUpdateFormValues] = useState<SunoUserMap>({});

  const validateCreateForm = () => {
    const errors: SunoUserError = {};
    
    if (!createFormValues.id) {
      errors.id = "User ID is required"
    };

    if (!createFormValues.status) {
      errors.status = "Status is required"
    };

    if (!createFormValues.cookie) {
      errors.cookie = "Cookie is required"
    };

    if (createFormValues.creditsLeft === undefined || createFormValues.creditsLeft === null) {
      errors.creditsLeft = "Credits are required";
    }
    
    return errors;
  };

  const validateUpdateForm = (userId: string) => {
    const errors: SunoUserError = {};
    const user = updateFormValues[userId];
    
    if (!user.cookie) {
      errors.cookie = "Cookie is required";
    }

    if (user.creditsLeft === undefined || user.creditsLeft === null) {
      errors.creditsLeft = "Credits are required";
    }
        
    return errors;
  };

  useEffect(() => {
    setSunoUsers(initialUsers);
    
    const initialUpdateFormValues = initialUsers.reduce((acc, user) => {
      acc[user.id] = {
        id: user.id,
        status: user.status,
        cookie: user.cookie,
        creditsLeft: user.creditsLeft
      };
      return acc;
    }, {} as SunoUserMap);
    setUpdateFormValues(initialUpdateFormValues);
  }, [initialUsers]);

  const handleCreateInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    
    setCreateFormValues({
      ...createFormValues,
      [name]: value
    });
  };

  const handleUpdateInputChange = (e: { target: { name: any; value: any; }; }, userId: string) => {
    const { name, value } = e.target;
    
    setUpdateFormValues({
      ...updateFormValues,
      [userId]: {
        ...updateFormValues[userId],
        [name]: value,
        status: updateFormValues[userId].creditsLeft ? SunoUserStatus.Active : SunoUserStatus.Blocked
      }
    });
  };

  const isValidForm = (errors: SunoUserError) => Object.keys(errors).length === 0;

  const handleCreate = async () => {
    const errors = validateCreateForm();
    if (!isValidForm(errors)) {
      alert(JSON.stringify(errors));
      
      return;
    }    

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormValues),
      });

      alert('Refresh the page to observe the changes');
    } catch (error) {
      alert('Error creating user');
    }
  };


  const handleSaveChanges = async (userId: string) => {
    const errors = validateUpdateForm(userId);
    if (!isValidForm(errors)) {
      alert(JSON.stringify(errors));
      
      return;
    }

    const updatedUser = updateFormValues[userId];
    
    try {
      await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      alert('Refresh the page to observe the changes');
    } catch (error) {
      alert('Error updating user');
    }
  };

  return (
    <Section className="my-10 flex flex-col w-full gap-4">
      <article className="prose lg:prose-lg max-w-4xl" >
        <h1 className="text-xl text-indigo-900 text-center flex">Suno Users: </h1>
        <h3 className="text-md m-0 text-indigo-900">Create User: </h3>
        <div className="flex flex-col gap-2 border p-4">
          <div>
            <strong>User Id: </strong>
            <input
              type="text"
              name="id"
              value={createFormValues.id}
              onChange={handleCreateInputChange}
              className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
            />
          </div>
          <div>
            <strong>Status: </strong>
            <select
              name="status"
              value={createFormValues.status}
              onChange={handleCreateInputChange}
              className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
            >
              <option value={SunoUserStatus.Active}>
                {SunoUserStatus.Active}
              </option>
              <option value={SunoUserStatus.Blocked}>
                {SunoUserStatus.Blocked}
              </option>
            </select>
          </div>
          <div>
            <strong>Cookie: </strong>
            <textarea
              name="cookie"
              value={createFormValues.cookie}
              onChange={handleCreateInputChange}
              className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
              rows={6}
              cols={60}
            ></textarea>
          </div>
          <div>
            <strong>Credits: </strong>
            <input
              type="number"
              name="creditsLeft"
              value={createFormValues.creditsLeft}
              onChange={handleCreateInputChange}
              className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleCreate}
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline text-white font-bold py-2 px-4 rounded"
            >
              Create User
            </button>
          </div>
        </div>
        <h3 className="text-md m-0 text-indigo-900">Update Users: </h3>
        <div className="flex flex-col w-full gap-3">
          {sunoUsers.map((user) => (
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
                  name="cookie"
                  value={updateFormValues[user.id]?.cookie || ''}
                  onChange={(e) => handleUpdateInputChange(e, user.id)}
                  className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
                  rows={6}
                  cols={60}
                ></textarea>
              </div>
              <div>
                <strong>Credits Left: </strong>
                {user.creditsLeft}
                <input
                  type="number"
                  name="creditsLeft"
                  value={updateFormValues[user.id]?.creditsLeft || undefined}
                  onChange={(e) => handleUpdateInputChange(e, user.id)}
                  className="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight"
                />
              </div>
              <div>
                <button
                  onClick={() => handleSaveChanges(user.id)}
                  className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline text-white font-bold py-2 px-4 rounded"
                >
                  Save changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </Section>
  );
};

export default AdminUsers;
