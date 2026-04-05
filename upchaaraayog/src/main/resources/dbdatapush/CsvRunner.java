//package com.upchaaraayog.services;

//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class CsvRunner implements CommandLineRunner {
//
//    private final CsvImportService service;
//
//    public CsvRunner(CsvImportService service) {
//        this.service = service;
//    }
//
//    @Override
//    public void run(String... args) {
//
//        String input = "src/main/resources/jan_aushadhi_kendra.csv";
//        String error = "src/main/resources/data_not_inserted.csv";
//
//        service.importCsv(input, error);
//
//        System.out.println("Import completed");
//    }
//}
