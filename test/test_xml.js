const validXML = `<mcq-test-results>
    <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
      <first-name>Jane</first-name>
      <last-name>Austen</last-name>
      <student-number>521585128</student-number>
      <test-id>1234</test-id>
      <summary-marks available="20" obtained="13" />
    </mcq-test-result>
  </mcq-test-results>`;

const validMultiXML = `<mcq-test-results>
  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
    <first-name>Jane</first-name>
    <last-name>Austen</last-name>
    <student-number>1</student-number>
    <test-id>1234</test-id>
    <summary-marks available="20" obtained="13" />
  </mcq-test-result>
  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
    <first-name>Jane</first-name>
    <last-name>Austen</last-name>
    <student-number>2</student-number>
    <test-id>1234</test-id>
    <summary-marks available="20" obtained="14" />
  </mcq-test-result>
  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
    <first-name>Jane</first-name>
    <last-name>Austen</last-name>
    <student-number>3</student-number>
    <test-id>1234</test-id>
    <summary-marks available="20" obtained="15" />
  </mcq-test-result>
  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
    <first-name>Jane</first-name>
    <last-name>Austen</last-name>
    <student-number>4</student-number>
    <test-id>1234</test-id>
    <summary-marks available="20" obtained="16" />
  </mcq-test-result>
</mcq-test-results>`;

const duplicateXMLAvailable = `<mcq-test-results>
<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
  <first-name>Jane</first-name>
  <last-name>Austen</last-name>
  <student-number>521585128</student-number>
  <test-id>1234</test-id>
  <summary-marks available="20" obtained="13" />
</mcq-test-result>
<mcq-test-result scanned-on="2017-12-05T12:12:10+11:00">
  <first-name>Jane</first-name>
  <last-name>Austen</last-name>
  <student-number>521585128</student-number>
  <test-id>1234</test-id>
  <summary-marks available="25" obtained="13" />
</mcq-test-result>
</mcq-test-results>`;

const duplicateXMLObtained = `<mcq-test-results>
<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
  <first-name>Jane</first-name>
  <last-name>Austen</last-name>
  <student-number>521585128</student-number>
  <test-id>1234</test-id>
  <summary-marks available="20" obtained="13" />
</mcq-test-result>
<mcq-test-result scanned-on="2017-12-05T12:12:10+11:00">
  <first-name>Jane</first-name>
  <last-name>Austen</last-name>
  <student-number>521585128</student-number>
  <test-id>1234</test-id>
  <summary-marks available="20" obtained="18" />
</mcq-test-result>
</mcq-test-results>`;

module.exports = {
  validXML,
  validMultiXML,
  duplicateXMLAvailable,
  duplicateXMLObtained,
};
