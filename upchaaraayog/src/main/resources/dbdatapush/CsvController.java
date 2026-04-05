//package com.upchaaraayog.controllers;
//
//import com.upchaaraayog.services.CsvImportService;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/import")
//public class CsvController {
//
//    private final CsvImportService service;
//
//    public CsvController(CsvImportService service) {
//        this.service = service;
//    }
//
//    @PostMapping
//    public String importCsv() {
//
//        String input = "/Users/ajay/Downloads/jan_aushadhi_kendra.csv";
//        String error = "/Users/ajay/Downloads/data_not_inserted.csv";
//
//        service.importCsv(input, error);
//
//        return "Import started";
//    }
//}
