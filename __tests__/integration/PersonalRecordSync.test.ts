import PersonalRecordPersistence from "../../services/storage/PersonalRecordPersistence";
import PersistenceService from "../../services/storage/PersistenceService";

jest.mock("../../services/storage/PersistenceService", () => ({
  database: {
    get: jest.fn(),
    write: jest.fn((cb) => cb()),
    batch: jest.fn(),
  },
}));

describe("PersonalRecordPersistence.syncForSession", () => {
  let mockQuery: jest.Mock;
  let mockPrepareCreate: jest.Mock;
  let batchOperations: any[];

  beforeEach(() => {
    jest.clearAllMocks();
    batchOperations = [];

    mockQuery = jest.fn().mockResolvedValue([]);
    mockPrepareCreate = jest.fn((cb) => {
      const pr: any = {};
      cb(pr);
      return { type: "create", pr };
    });

    (PersistenceService.database.get as jest.Mock).mockReturnValue({
      query: mockQuery,
      prepareCreate: mockPrepareCreate,
    });

    (PersistenceService.database.batch as jest.Mock).mockImplementation((...ops) => {
      batchOperations.push(...ops);
      return Promise.resolve();
    });
  });

  it("should create new PRs when adding sets for the first time", async () => {
    const sets = [{ weight: 100, reps: 5 }];

    await PersonalRecordPersistence.syncForSession("Bench Press", "2024-01-01", sets);

    expect(PersistenceService.database.batch).toHaveBeenCalled();
    expect(batchOperations.length).toBe(5);
    batchOperations.forEach((op) => {
      expect(op.type).toBe("create");
      expect(op.pr.weight).toBe(100);
      expect(op.pr.reps).toBeGreaterThanOrEqual(1);
      expect(op.pr.reps).toBeLessThanOrEqual(5);
    });
  });

  it("should update PRs correctly when modifying a set (lowering the weight)", async () => {
    const existingRecords = [1, 2, 3, 4, 5].map((rep) => ({
      reps: rep,
      weight: 100,
      syncStatus: "synced",
      prepareUpdate: jest.fn((cb) => {
        const pr = { weight: 100 };
        cb(pr);
        return { type: "update", reps: rep, newWeight: pr.weight };
      }),
      prepareMarkAsDeleted: jest.fn(() => ({ type: "delete", reps: rep })),
    }));

    mockQuery.mockResolvedValue(existingRecords);

    const sets = [{ weight: 80, reps: 5 }];

    await PersonalRecordPersistence.syncForSession("Bench Press", "2024-01-01", sets);

    expect(PersistenceService.database.batch).toHaveBeenCalled();
    expect(batchOperations.length).toBe(5);
    batchOperations.forEach((op) => {
      expect(op.type).toBe("update");
      expect(op.newWeight).toBe(80);
    });
  });

  it("should delete PRs that are no longer valid because reps decreased", async () => {
    const existingRecords = [1, 2, 3, 4, 5].map((rep) => ({
      reps: rep,
      weight: 100,
      syncStatus: "synced",
      prepareUpdate: jest.fn(),
      prepareMarkAsDeleted: jest.fn(() => ({ type: "delete", reps: rep })),
    }));

    mockQuery.mockResolvedValue(existingRecords);

    const sets = [{ weight: 100, reps: 3 }];

    await PersonalRecordPersistence.syncForSession("Bench Press", "2024-01-01", sets);

    expect(PersistenceService.database.batch).toHaveBeenCalled();
    expect(batchOperations.length).toBe(2);
    expect(batchOperations).toEqual([
      { type: "delete", reps: 4 },
      { type: "delete", reps: 5 },
    ]);
  });

  it("should calculate correctly with multiple sets in one session", async () => {
    mockQuery.mockResolvedValue([]);

    const sets = [
      { weight: 100, reps: 3 },
      { weight: 90, reps: 5 },
    ];

    await PersonalRecordPersistence.syncForSession("Bench Press", "2024-01-01", sets);

    expect(batchOperations.length).toBe(5);
    const pr1 = batchOperations.find(op => op.pr.reps === 1);
    expect(pr1.pr.weight).toBe(100);
    const pr4 = batchOperations.find(op => op.pr.reps === 4);
    expect(pr4.pr.weight).toBe(90);
  });
});
