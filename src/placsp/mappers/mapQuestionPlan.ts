import type { PlacspTender } from '../types/PlacspTender'

/** Every step `placsp pregunta` would take, from the guide (Guía del Operador Económico v5.3, 3.1 and 3.3). */
export const mapQuestionPlan = (
  tender: PlacspTender,
  text: string,
): readonly string[] => [
  'Log in on the "Empresas" page (LoginForm: wps.portlets.userid, password) with the operator account.',
  `Open ${tender.enlace}`,
  `Check the detail is still expediente ${tender.expediente} of ${tender.organoContratacion}, state ${tender.estado}.`,
  'Open the "Solicitar Información" tab; read "Fecha límite para hacer preguntas" and refuse when it has passed.',
  'Press "Nueva Pregunta", write the text below, press "Enviar".',
  `Question text (${String(text.length)} characters):`,
  text,
  'Read the new row of the question list: "Pendiente" with its "Actualización" timestamp is the receipt.',
]
