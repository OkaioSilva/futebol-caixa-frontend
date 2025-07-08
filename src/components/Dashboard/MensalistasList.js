import React from 'react';

export const MensalistasList = ({ mensalistas }) => (
  <ul>
    {mensalistas.map((m) => (
      <li key={m.id}>{m.nome} - {m.status_pagamento ? '✅' : '❌'}</li>
    ))}
  </ul>
);