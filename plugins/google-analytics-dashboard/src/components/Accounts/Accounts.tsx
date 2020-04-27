/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useContext } from 'react';
import { Context } from 'contexts/Context';
import { useAsync } from 'react-use';
import api from 'api';
import { Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';
import Select from 'components/Select';

const Accounts: FC<{}> = () => {
  const { account, setCurrentAccount } = useContext(Context);

  const { value, loading, error } = useAsync(async () => {
    const results = await api.listAccounts();
    return results;
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const accounts =
    value.items?.map((item: any) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const handleAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAccount({
      name: accounts.filter((v: any) => v.value === event.target.value)[0]
        .label,
      id: event.target.value,
    });
  };

  return <Select value={account.id} handler={handleAccount} items={accounts} />;
};

export default Accounts;