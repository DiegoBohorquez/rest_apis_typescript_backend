import request from "supertest";
import server, { connectDB } from "../server";
import db from "../config/db";

describe("connectDB", () => {
  it("should handle database connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(new Error("Hubo un error al conectar la BD"));

    const consoleSpy = jest.spyOn(console, "log");

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar la DB"),
    );

    consoleSpy.mockRestore();
  });
});
