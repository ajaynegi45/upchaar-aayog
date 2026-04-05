//package com.upchaaraayog.services;
//
//import com.opencsv.CSVReader;
//import com.opencsv.CSVReaderBuilder;
//import com.opencsv.CSVWriter;
//import com.upchaaraayog.entities.JanAushadhiKendra;
//import com.upchaaraayog.repositories.JanAushadhiRepository;
//import org.springframework.stereotype.Service;
//
//import java.io.FileReader;
//import java.io.FileWriter;
//import java.util.*;
//
//@Service
//public class CsvImportService {
//
//    private final JanAushadhiRepository repository;
//
//    public CsvImportService(JanAushadhiRepository repository) {
//        this.repository = repository;
//    }
//
//    public void importCsv(String inputFile, String errorFile) {
//
//        List<JanAushadhiKendra> batch = new ArrayList<>();
//        Set<String> seenCodes = new HashSet<>();
//
//        int batchSize = 1000;
//
//        try (
//                CSVReader reader = new CSVReaderBuilder(new FileReader(inputFile))
//                        .withSkipLines(1)
//                        .build();
//
//                CSVWriter errorWriter = new CSVWriter(new FileWriter(errorFile))
//        ) {
//
//            String[] row;
//
//            errorWriter.writeNext(new String[]{
//                    "reason", "kendra_code", "name", "state",
//                    "district", "pincode", "address"
//            });
//
//            while ((row = reader.readNext()) != null) {
//
//                // DEBUG (remove later)
//                // System.out.println(Arrays.toString(row));
//
//                // STRICT COLUMN CHECK
//                if (row.length != 6) {
//                    writeError(errorWriter, "COLUMN_MISMATCH_" + row.length, row);
//                    continue;
//                }
//
//                try {
//                    // trim edges only
//                    for (int i = 0; i < row.length; i++) {
//                        if (row[i] != null) row[i] = row[i].trim();
//                    }
//
//                    String kendraCode = row[0];
//                    String name = row[1];
//                    String state = row[2];
//                    String district = row[3];
//                    String pincodeStr = row[4];
//                    String address = row[5];
//
//                    // VALIDATION
//                    if (isBlank(kendraCode)) {
//                        writeError(errorWriter, "EMPTY_KENDRA_CODE", row);
//                        continue;
//                    }
//
//                    if (seenCodes.contains(kendraCode)) {
//                        writeError(errorWriter, "DUPLICATE_IN_FILE", row);
//                        continue;
//                    }
//
//                    if (isBlank(name) || isBlank(state) || isBlank(district) || isBlank(address)) {
//                        writeError(errorWriter, "REQUIRED_FIELD_MISSING", row);
//                        continue;
//                    }
//
//                    Integer pincode;
//                    try {
//                        pincode = Integer.parseInt(pincodeStr);
//                    } catch (Exception e) {
//                        writeError(errorWriter, "INVALID_PINCODE", row);
//                        continue;
//                    }
//
//                    JanAushadhiKendra entity = new JanAushadhiKendra();
//
//                    // DO NOT set ID manually
//                    entity.setKendraCode(kendraCode);
//                    entity.setKendraName(name);
//                    entity.setState(state);
//                    entity.setDistrict(district);
//                    entity.setPincode(pincode);
//                    entity.setAddress(address);
//
//                    batch.add(entity);
//                    seenCodes.add(kendraCode);
//
//                    if (batch.size() >= batchSize) {
//                        saveBatchWithFallback(batch, errorWriter);
//                        batch.clear();
//                    }
//
//                } catch (Exception ex) {
//                    ex.printStackTrace(); // IMPORTANT
//                    writeError(errorWriter, ex.getClass().getSimpleName(), row);
//                }
//            }
//
//            if (!batch.isEmpty()) {
//                saveBatchWithFallback(batch, errorWriter);
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void saveBatchWithFallback(List<JanAushadhiKendra> batch, CSVWriter errorWriter) {
//        try {
//            repository.saveAll(batch);
//        } catch (Exception batchEx) {
//
//            // fallback row-by-row
//            for (JanAushadhiKendra entity : batch) {
//                try {
//                    repository.save(entity);
//                } catch (Exception ex) {
//                    writeError(errorWriter, "DB_CONSTRAINT_FAIL", new String[]{
//                            entity.getKendraCode(),
//                            entity.getKendraName(),
//                            entity.getState(),
//                            entity.getDistrict(),
//                            String.valueOf(entity.getPincode()),
//                            entity.getAddress()
//                    });
//                }
//            }
//        }
//    }
//
//    private boolean isBlank(String s) {
//        return s == null || s.trim().isEmpty();
//    }
//
//    private void writeError(CSVWriter writer, String reason, String[] row) {
//        String[] errorRow = new String[row.length + 1];
//        errorRow[0] = reason;
//        System.arraycopy(row, 0, errorRow, 1, row.length);
//        writer.writeNext(errorRow);
//    }
//}