/** The general-registry schema reduced to what the client reads: three fields and one attachment slot. */
export const registrySchemaFixture = {
  sections: {
    data: {
      elements: [
        {
          id: 'E1',
          fields: [
            {
              id: 'CBDIR3',
              type: 'text',
              items: [{ key: 'K1', label: 'A11030071-Serv. Gestión Ayudas' }],
            },
          ],
        },
        { id: 'E2', fields: [{ id: 'TEEFONO', type: 'text' }] },
        { id: 'E3', fields: [{ id: 'ANNOT_TEXT_EXTRACT', type: 'textarea' }] },
      ],
    },
    documents: { elements: [{ id: 'G1', documents: [{ id: 'D1' }] }] },
  },
}
