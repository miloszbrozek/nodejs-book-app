import {ProcessingService} from "./processing.service";
import {Import, ProcessableEntity} from "./types";

describe('ProcessingService', () => {
  let processingService: ProcessingService<Import>;
  let processingProcessMock: any;

  beforeEach(async () => {
    jest.useFakeTimers();
    processingService = new ProcessingService<Import>({
      evernote: 4, pdf: 8, wattpad: 16, word: 32,
    });
  });

  const whenMockedProcess = () => {
    processingProcessMock = jest.fn()
    processingService.process = processingProcessMock;
  }

  const isProcessed = (entity: ProcessableEntity) => {
    return entity.state === 'finished' && entity.updated_at !== undefined
  }

  const isNotProcessed = (entity: ProcessableEntity) => {
    return entity.state === 'pending' && entity.updated_at === undefined
  }

  describe('process', () => {
    it('should process entities', () => {
      const evernote: ProcessableEntity = {created_at: new Date(), state: 'pending', type: "evernote"};
      const pdf: ProcessableEntity = {created_at: new Date(), state: 'pending', type: "pdf"};
      const wattpad: ProcessableEntity = {created_at: new Date(), state: 'pending', type: "wattpad"};
      processingService.process(evernote);
      processingService.process(pdf);
      processingService.process(wattpad);

      jest.advanceTimersByTime(1000 * 5);
      expect(isProcessed(evernote));
      expect(isNotProcessed(pdf));
      expect(isNotProcessed(wattpad));

      jest.advanceTimersByTime(1000 * 5);
      expect(isProcessed(evernote));
      expect(isProcessed(pdf));
      expect(isNotProcessed(wattpad));
    });
  });

  describe('create', () => {
    it('should correctly create a new processable entity', () => {
      whenMockedProcess();
      const createdImport = processingService.create({
        bookId: 'someId',
        type: 'pdf',
        url: 'some url'
      });

      expect(createdImport.state).toBe("pending");
      expect(createdImport.created_at).toBeTruthy();
      expect(processingProcessMock.mock.calls[0][0].type).toBe('pdf');
      expect(processingService['entities'].length).toBe(1);
    });
  });

  describe('getListByStates', () => {
    it('should return an empty list', () => {
      expect(processingService.getListByStates()).toMatchObject({});
    });
  });

  describe('getListByStates', () => {
    it('should return instances grouped by states correctly', () => {
      processingService['entities'] = [{state:'state1'}, {state:'state2'}, {state:'state1'}, {state:'state2'}, {state:'state1'}] as any;
      const returnedList = processingService.getListByStates();
      const state1List = returnedList['state1'];
      const state2List = returnedList['state2'];

      expect(state1List).toBeTruthy();
      expect(state2List).toBeTruthy();
      expect(state1List.length).toBe(3);
      expect(state2List.length).toBe(2);
    });
  });
});
