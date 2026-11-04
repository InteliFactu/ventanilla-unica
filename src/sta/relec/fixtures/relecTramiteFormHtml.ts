import { relecFormHtml } from './relecFormHtml'

/** Synthetic catalogue form with template rows and holder-specific fixed rows. */
export const relecTramiteFormHtml = relecFormHtml
  .replace('APORTACION', 'CATALOGUE')
  .replace('Aportaci&oacute;n de documentaci&oacute;n ', 'Catalogue procedure')
  .replace('6269000000002829307935', '6269000000000000000001')
  .replace(
    '</form>',
    `<input type="checkbox" name="hasRepresentative"/>
    <input name="DinTitANNOT_TEXT_EXTRACT" value="Asunto:"/>
    <textarea name="DinVarANNOT_TEXT_EXTRACT"></textarea>
    ${['NEW', '2000400000000000000009']
      .flatMap((person) =>
        ['61', '62'].map(
          (slot) => `<input name="${slot}_${person}DocReq" value="${slot}"/>
          <input name="${slot}_${person}name" value="${slot === '61' ? 'Application' : 'Identity document'}"/>
          <input name="${slot}_${person}description" value="Supporting PDF"/>
          <input name="${slot}_${person}tipo" value="2017000000004854907935"/>
          <input name="${slot}_${person}required" value="${slot === '61' ? 'true' : 'false'}"/>
          <input name="${slot}_${person}firma" value="true"/>
          <input name="${slot}_${person}pid" value="false"/>
          <input name="${slot}_${person}dboid" value=""/>
          <input name="${slot}_${person}CUD" value=""/>
          <input name="${slot}_${person}file" value=""/>
          <input name="${slot}_${person}reusable" value=""/>
          <input name="${slot}_${person}FechaIni" value=""/>
          <input name="${slot}_${person}FechaFin" value=""/>
          <button onclick="openUploader('${slot}','pdf','S','${person}','0','true','false','','true')">Attach</button>`,
        ),
      )
      .join('')}
    </form>`,
  )
