import email from "infra/email";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    const baseEmail = {
      from: "BakeCake <contact@bakecake.com.br>",
      to: "contact.john@gmail.com",
    };

    await email.send({
      ...baseEmail,
      subject: "Subject test",
      text: "Body test",
    });

    await email.send({
      ...baseEmail,
      subject: "Last sent email",
      text: "Body from last sent email",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contact@bakecake.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contact.john@gmail.com>");
    expect(lastEmail.subject).toBe("Last sent email");
    expect(lastEmail.text).toBe("Body from last sent email\n");
  });
});
