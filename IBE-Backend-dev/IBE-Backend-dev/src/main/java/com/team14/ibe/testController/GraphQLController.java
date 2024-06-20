package com.team14.ibe.testController;

import com.team14.ibe.service.GraphQLTestingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GraphQLController {
    GraphQLTestingService graphQLTestingService;

    @Autowired
    public GraphQLController(GraphQLTestingService graphQLTestingService) {
        this.graphQLTestingService = graphQLTestingService;
    }

    @GetMapping("/getrooms")
    public ResponseEntity<String> getRoomsFromGraphQL() {
        return graphQLTestingService.getRooms();
    }
}
