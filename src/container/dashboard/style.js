import Styled from "styled-components";

const EChartCard = Styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    .card-chunk{
        width: 50%;
        flex: 0 0 50%;
    }
    @media only screen and (max-width: 379px){
        .card-chunk{
            width: 100%;
            flex: 0 0 100%;
            h1{
                margin-bottom: 0;
            }
            p{
                margin: 5px 0 20px 0;
            }
        }
    }
    .chartjs-tooltip {
        min-width: 132px !important;
    }
`;

const OverviewSalesCard = Styled.div`
    display: flex;
    align-items: flex-start;
    padding: 5px 0 2px 0;
    .icon-box{
        display: flex;
        aling-items: center;
        justify-content: center;
        height: 60px;
        width: 60px;
        border-radius: 10px;
        margin-right: 10px;
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 10px;
        @media only screen and (max-width: 1399px){
            height: 40px;
            width: 40px;
        }
        @media only screen and (max-width: 991px){
            height: 60px;
            width: 60px;
        }
        img{
            max-width: 35px;
        }
        &.box-primary{
            background-color: ${({ theme }) => theme["primary-color"]}10;
        }
        &.box-success{
            background-color: ${({ theme }) => theme["success-color"]}10;
        }
        &.box-secondary{
            background-color: ${({ theme }) => theme["secondary-color"]}10;
        }
    }
    .card-chunk{
        h2{
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 2px;
            color: ${({ theme }) => theme["dark-color"]};
        }
        span{
            color: ${({ theme }) => theme["light-gray-color"]};
        }
        p{
            margin-top: 16px;
        }
    }
`;
const DashboardBaseStyleWrap = Styled.div`
    h1{
        margin-bottom: 30px;
    }
    .ant-row{
        margin: -5px 0;
    }
    .ant-col{
        margin: 5px 0;
    }
`;

const Focard = Styled.div`
    canvas{
        width: 100% !important;
        margin-top: 50px;
        @media only screen and (max-width: 1199px){
            margin-top: 15px;
        }
    }
    .focard-details{
        &.growth-downward{
            h1{                
                font-size: 30px;
                @media only screen and (max-width: 767px){
                    font-size: 24px;
                }
            }
            .focard-status{
                .focard-status__percentage{
                    color: ${({ theme }) => theme["danger-color"]};
                    font-size: 16px;
                }
            }
        }
        &.growth-upward{
            .focard-status{
                .focard-status__percentage{
                    color: ${({ theme }) => theme["success-color"]};
                    font-size: 16px;
                }
            }
        }
        h1{
            font-weight: 600;
            margin-bottom: 2px;
        }
        .subtitle{
            font-size: 14px;
            color: #868EAE;
            margin-bottom: 10px;
        }
        .focard-status{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: 0 -5px;
            span{
                display: inline-flex;
                align-items: center;
                margin: 0 5px;
                &.focard-status__percentage{
                    font-weight: 500;
                }
            }
            span + span{
                color: #868EAE;
                font-size: 13px;
            }
        }
        svg{
            width: 15px;
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
        }
    }

    .focard-chart{
        ${({ theme }) => (theme.rtl ? "margin-right" : "margin-left")}: -10px;
    }

    @media (max-width: 1300px){
        .focard-details{
            h1{
                font-size: 24px;
            }
            &.growth-downward{
                h1{
                    font-size: 24px;
                }
            }
        }
    }

    .forcast-card-box{
        .ant-card-body{
            padding: 0 !important;
            h1{
                padding: ${({ theme }) =>
                  theme.rtl ? "25px 25px 0 0" : "25px 0 0 25px"};
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 26px;
                @media only screen and (max-width: 767px){
                    margin-bottom: 16px;
                }
            }
        }

        .focard-details{
            margin-top: 15px;
            padding: 0 25px 22px;
            @media only screen and (max-width: 767px){
                padding: 0 25px 0;
            }
            h1{
                padding: 0;
                font-size: 30px;
                font-weight: 600;
                margin-bottom: 4px;
                @media only screen and (max-width: 767px){
                    font-size: 24px;
                }
            }
            p{
                margin-bottom: 0;
            }
        }
        canvas{
            margin-top: 0px;
            border-radius: 0 0 10px 10px;
        }
        .chart-label{
            display: none;
        }
    }
`;

const CardBarChart = Styled.div`
    >div{
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            align-items: flex-start !important;
            ul{
                margin: 0 0 15px;
            }
        }
    }
    .card-bar-top{
        &.flex-grid{
            ${({ theme }) =>
              theme.rtl ? "margin-right" : "margin-left"}: -20px;
            @media only screen and (max-width: 575px) {
                flex-flow: column;
                align-items: center;
            }
            h1{
                font-size: 24px;
                margin-bottom: 22px;
                @media only screen and (max-width: 1199px) {
                    font-size: 20px;
                }
            }
        }
        .flex-grid-child{
            padding: 0 20px;
        }
        p{
            font-size: 14px;
            margin-bottom: 8px;
            color: ${({ theme }) => theme["light-color"]};
        }
        h1{
            margin-bottom: 18px;
            sub{
                bottom: 0;
                font-size: 14px;
                ${({ theme }) =>
                  theme.rtl ? "margin-right" : "margin-left"}: 8px;
                color: ${({ theme }) => theme["success-color"]};
                svg{
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 4px;
                }
            }
        }
    }
    ul{
        margin-top: 15px;
    }
    .chart-dataIndicator{
        li{
            font-size: 13px;
            color: ${({ theme }) => theme["gray-color"]};
            &:not(:last-child){
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 16px;
            }
        }
    }
    .chartjs-tooltip{
        min-width: 140px !important;
        @media only screen and (max-width: 1199px){
            min-width: 115px !important;
        }
    }
    .deals-barChart{
        display: flex;
        .card-bar-top{
            &:not(:last-child){
                margin-right: 30px;
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 30px;
            }
        }
        h4{
            font-weight: 400;
            color: ${({ theme }) => theme["light-gray-color"]};
            p{
                &.growth-down{
                    .deal-percentage{
                        color: ${({ theme }) => theme["danger-color"]};
                    }
                }
                &.growth-up{
                    .deal-percentage{
                        color: ${({ theme }) => theme["success-color"]};
                    }
                }
                .deal-percentage{
                    svg,
                    img,
                    i{
                        margin-right: 3px;
                    }
                }
                .deal-value{
                    font-size: 22px;
                    font-weight: 600;
                    margin-right: 8px;
                    color: ${({ theme }) => theme["dark-color"]};
                }
            }
        }
    }
    .deals-list{
        .custom-label{
            font-size: 14px;
            &:not(:last-child){
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 30px;
            }
        }
    }
`;

const CardGroup = Styled.div`
    .forcast-overview{
        .ant-card-body{
            padding: 0 24px !important;
            @media only screen and (max-width: 1199px){
                padding: 24px 24px 0 24px !important;
            }
        }
    }
    .card-radio{
        .ant-radio-button-wrapper{
            height: 30px;
            line-height: 28px;
            font-size: 12px;
            font-weight: 500;
            padding: 0 10.5px;
            color: ${({ theme }) => theme["gray-color"]};
            border-color: ${({ theme }) => theme["border-color-light"]};
            &:before{
                display: none;
            }
            &:focus-within{
                box-shadow: 0 0;
            }
            &:first-child{
                border-radius: 3px 0 0 3px;
            }
            &:last-child{
                border-radius: 0 3px 3px 0;
            }
            &.ant-radio-button-wrapper-checked{
                color: #fff !important;
                background: ${({ theme }) => theme["primary-color"]} !important;
                &:hover{
                    color: #fff !important;
                    background: ${({ theme }) =>
                      theme["primary-color"]} !important;
                }
            }
            &:hover{
                background: ${({ theme }) =>
                  theme["bg-color-normal"]} !important;
            }
        }
    }
    .focard-wrapper{
        margin: 0 -12px;
        ${({ theme }) =>
          theme.rtl
            ? "padding: 24px 24px 25px 0;"
            : "padding: 24px 0 25px 24px;"};
        ${({ theme }) =>
          theme.topMenu ? "padding-bottom: 0px" : "padding-bottom: 25px"};
        
        @media only screen and (max-width: 1350px){
            padding: 24px 0 25px 10px;
        }
        @media only screen and (max-width: 1199px){
            margin: 0;
        }
        .ant-col-md-12{
            ${({ theme }) =>
              theme.rtl ? "padding: 0 12px 0 18px;" : "padding: 0 18px 0 12px;"}
            
            @media only screen and (max-width: 1350px){
                ${({ theme }) =>
                  theme.rtl
                    ? "padding: 0 6px 0 14px;"
                    : "padding: 0 14px 0 6px;"}                
            }
            @media only screen and (max-width: 575px){
                &:not(:last-child){
                    margin-bottom: 20px;
                }
            }
            &:first-child{
                @media only screen and (max-width: 1350px){
                    ${({ theme }) =>
                      !theme.rtl ? "padding-left" : "padding-right"}: 20px;
                }
                @media only screen and (max-width: 1199px){
                    padding: ${({ theme }) =>
                      theme.rtl ? "0 0 0 12px" : "0 12px 0 0"};
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
            }
            &:last-child{
                padding: 0 14px 0 18px;
                @media only screen and (max-width: 1350px){
                    &:last-child{
                        padding: 0 10px 0 14px;
                    }
                }
                @media only screen and (max-width: 1199px){
                    &:last-child{
                        padding: 0 0 0 12px;
                        @media only screen and (max-width: 575px){
                            padding: 0;
                        }
                    }
                }
            }
        }

        &.focard-divider{
            ${({ theme }) =>
              !theme.rtl ? "padding-left" : "padding-right"}: 0;
            ${({ theme }) =>
              theme.rtl ? "padding-left" : "padding-right"}: 15px;
            ${({ theme }) =>
              !theme.rtl ? "border-right" : "border-left"}: 1px solid ${({
  theme,
}) => theme["border-color-light"]} !important;
            @media only screen and (max-width: 1199px){
                ${({ theme }) =>
                  theme.rtl
                    ? "padding-left"
                    : "padding-right"}: 0 none !important;
                padding: ${({ theme }) =>
                  theme.rtl ? "0 10px 0 0" : "0 0 0 10px"};
            }
            .ant-col-md-12{
                &:first-child{
                    padding: 0 16px 0 24px;
                    @media only screen and (max-width: 1350px){
                        padding: ${({ theme }) =>
                          theme.rtl ? "0 20px 0 10px" : "0 10px 0 20px"};
                    }
                    @media only screen and (max-width: 1199px){
                        padding: ${({ theme }) =>
                          theme.rtl ? "0 0 0 12px" : "0 12px 0 0"};
                    }
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
                &:last-child{
                    padding: ${({ theme }) =>
                      theme.rtl ? "0 18px 0 10px" : "0 10px 0 18px"};
                    @media only screen and (max-width: 1350px){
                        padding: ${({ theme }) =>
                          theme.rtl ? "0 20px 0 4px" : "0 4px 0 20px"};
                    }
                    @media only screen and (max-width: 1199px){
                        padding: ${({ theme }) =>
                          theme.rtl ? "0 12px 0 0px" : "0 0 0 12px"};
                    }
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
            }
        }
    }

    .traffic-table{
        min-height: 438px;
        .ant-table{
            border-radius: 10px;
        }
        table{
            color: #333;
            thead{
                th{
                    background-color: ${({ theme }) => theme["bg-color-light"]};
                    padding: 11.5px 16px;
                    &:nth-child(2){
                        border-left: 1px solid ${({ theme }) =>
                          theme["border-color-light"]};
                    }
                    &:nth-child(4){
                        border-right: 1px solid ${({ theme }) =>
                          theme["border-color-light"]};
                    }
                }
            }
            tbody{
                tr{
                    &:hover{
                        td{
                            background: ${({ theme }) =>
                              theme["bg-color-light"]};
                            .social-name{
                                color: ${({ theme }) => theme["primary-color"]};
                            }
                        }
                    }
                }
                td{
                    padding: 14.5px 15px;
                    text-align: ${({ theme }) =>
                      theme.rtl ? "left" : "right"};;
                    ${({ theme }) =>
                      theme.rtl
                        ? "border-left"
                        : "border-right"};: 1px solid ${({ theme }) =>
  theme["border-color-light"]};
                    color: ${({ theme }) => theme["gray-color"]};
                    &:first-child{
                        ${({ theme }) =>
                          !theme.rtl ? "border-left" : "border-right"};: 0 none;
                        text-align: ${({ theme }) =>
                          !theme.rtl ? "left" : "right"};;
                        ${({ theme }) =>
                          !theme.rtl ? "padding-left" : "padding-right"};: 25px;
                    }
                    &:last-child{
                        ${({ theme }) =>
                          theme.rtl ? "border-left" : "border-right"};: 0 none;
                        ${({ theme }) =>
                          theme.rtl ? "padding-left" : "padding-right"};: 25px;
                    }
                    .traffic-title{
                        font-weight: 500;
                        color: ${({ theme }) => theme["dark-color"]};
                    }
                    .social-name{
                        color: ${({ theme }) => theme["info-color"]};
                    }
                }
            }
        }
    }
`;

const ExList = Styled.div`
    padding: 25px 0 0;
    height: 100%;
    ${({ theme }) =>
      theme.rtl ? "border-left" : "border-right"}: 1px solid ${({ theme }) =>
  theme["border-color-light"]};
    @media only screen and (max-width: 1599px){
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        ${({ theme }) => (theme.rtl ? "border-left" : "border-right")}: 0 none;
        margin: 0 -15px;
        padding: 15px 0 0;

    }
    div{
        margin-bottom: 25px;
        @media only screen and (max-width: 1599px){
            flex: 0 0 25%;
            padding: 15px;
            margin-bottom: 10px;
        }
        @media only screen and (max-width: 1199px){
            flex: 0 0 50%;
            padding: 5px 15px;
            margin-bottom: 5px;
        }
        @media only screen and (max-width: 575px){
            flex: 0 0 100%;
            text-align: center;
        }
        p{
            font-size: 14px;
            color: ${({ theme }) => theme["light-gray-color"]};
            margin-bottom:0;
        }
        h1{
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 0;
            @media only screen and (max-width: 991px){
                font-size: 20px;
            }
            & > span{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 10px;
                @media only screen and (max-width: 1599px){
                    display: block;
                }
            }
            sub{
                font-size: 13px;
                font-weight: 400;
                display: inline-flex;
                align-items: center;
                line-height: normal;
                color: ${({ theme }) => theme["light-color"]};
                span{
                    display: inline-flex;
                    align-items: center;
                    color: ${({ theme }) => theme["success-color"]};
                    padding: ${({ theme }) =>
                      theme.rtl ? "0 0 0 10px" : "0 10px 0 0"};
                }
                svg{
                    width:12px;
                }
                &.growth-downward{
                    span{
                        color: ${({ theme }) => theme["danger-color"]};
                    }
                }
            }
        }
    }
`;

const OverviewCard = Styled.div`
    background: #fff;
    border-radius: 10px;
    padding: 25px 25px 20px;
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-bottom: 30px;
    ${({ theme }) =>
      theme.topMenu ? "min-height: 595px" : "min-height: auto"};
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    &:before{
        position: absolute;
        content: '';
        width: 100%;
        height: 53%;
        background:${(props) =>
          props.color === "true"
            ? " linear-gradient(180.5deg, rgb(0, 128, 128) 8.5%, rgb(174, 206, 100) 118.2%)"
            : "linear-gradient(180.5deg, rgb(246, 4, 26) 0.4%, rgb(251, 139, 34) 100.2%)"};
        
        
      
        top: 0;
        z-index:-1;
        left: 0;
    }
    .overview-box{
        .ant-card-body{
            padding: 22px 25px 14px !important;
        }
        .ant-progress{
            margin-bottom: 15px;
        }
        .ant-progress-bg{
            height: 6px !important;
        }
        .overview-box-single{
            h1{
                margin-bottom: 0;
            }
            p{
                color: ${({ theme }) => theme["light-color"]};
            }
        }
        .growth-downward,
        .growth-upward{
            span{
                ${({ theme }) =>
                  theme.rtl ? "margin-right" : "margin-left"}: 6px;
            }
        }
        .overview-box-percentage{
            font-weight: 500;
        }
    }
    .ant-card{
        box-shadow: 0 10px 30px rgba(146,153,184,0.15);
        .growth-upward{
            color: ${({ theme }) => theme["success-color"]};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({ theme }) => theme["light-gray-color"]};
                font-weight: 400;
                font-size: 13px;
            }
        }
        .growth-downward{
            color: ${({ theme }) => theme["danger-color"]};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({ theme }) => theme["light-gray-color"]};
                font-weight: 400;
                font-size: 13px;
            }
        }
    }
    .overview-head{
        margin-bottom: 70px;
        h1{
            font-size: 16px;
            font-weight: 500;
            color: #fff;
        }
        .ant-btn-default{
            font-size: 12px;
            background: rgba(255,255,255,0.1);
            padding: 0px 11px;
            border: 0 none;
            color: #fff;
            svg,
            img,
            i{
                ${({ theme }) =>
                  theme.rtl ? "margin-right" : "margin-left"}: 8px;
            }
        }
    }
`;

const PerformanceChartWrapper = Styled.div`
    @media only screen and (max-width: 1599px){
        min-height: 524px;
        background: #fff;
        border-radius: 10px;
    }
    .performance-lineChart{
        margin-top: 20px;
        .chart-label{
            display: none;
        }
        ul{
            margin-top: 16px;
            li{
                &:not(:last-child){
                    ${({ theme }) =>
                      !theme.rtl ? "margin-right" : "margin-left"}: 25px;
                }
            }
        }
    }
    .chartjs-tooltip{
        min-width: 175px !important;
        @media only screen and (max-width: 767px){
            min-width: 150px !important;
        }
    }
`;

const Pstates = Styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: -24px 0 25px;
    @media only screen and (max-width: 767px){
        margin: -19px 0 25px;
        flex-flow: column;
    }
    >div{
        transition: 0.3s ease;
        padding: 20px;
        @media only screen and (max-width: 1599px){
            flex: 0 0 50%;
        }
        &:hover{
            box-shadow: 0 15px 30px rgba(146,153,184,0.15);
            p{
                font-weight: 500;
                color: ${({ theme }) => theme["primary-color"]};
            }
        }
        &.active{
            background: ${({ theme }) => theme["bg-color-light"]};
            &:hover{
                box-shadow: 0 15px 30px #fff;
            }
        }
    }
    .growth-upward,
    .growth-downward{
        cursor: pointer;
        &:focus{
            outline: none
        }
        h1{
            font-size: 24px;
            sub{
                span{
                    font-weight: 500;
                }
            }
        }
    }
`;

const SessionChartWrapper = Styled.div`
    min-height: 510px;
    background: #fff;
    border-radius: 10px;
    @media only screen and (max-width: 1599px){
        min-height: 440px;
    }
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    .session-chart-inner{
        ul{
            display: flex;
            max-width: 365px;
            margin: 40px auto 6px auto;
            li{
                width: 33.33%;
                text-align: center;
                position: relative;
                .doughnutLabelColor{
                    position: absolute;
                    display: block;
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                    top: 50%;
                    transform: translateY(-50%);
                    ${({ theme }) => (theme.rtl ? "right" : "left")}: 14px;
                    @media only screen and (max-width: 1400px){
                        ${({ theme }) => (theme.rtl ? "right" : "left")}: 5px;
                    }
                    @media only screen and (max-width: 1300px){
                        ${({ theme }) => (theme.rtl ? "right" : "left")}: 0;
                    }
                    @media only screen and (max-width: 1199px){
                        ${({ theme }) => (theme.rtl ? "right" : "left")}: 15px;
                    }
                    @media only screen and (max-width: 379px){
                        ${({ theme }) => (theme.rtl ? "right" : "left")}: 0;
                    }
                }
                .doughnutLabe{
                    color: ${({ theme }) => theme["gray-color"]};
                }
            }
        }
        p{
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            width: 200px;
            margin-bottom: 0;
            display: inline-block;
            transform: translate(-50%, -50%);
            span{
                font-size: 24px;
                display: block;
                font-weight: 600;
            }
        }
    }
`;

const SessionState = Styled.div`
    /* // margin: 0 0 15px -15px; */
    max-width: 365px;
    margin: 42px auto auto;
    >div{
        width: 33.33%;
        text-align: center;
        span{
            font-size: 18px;
            font-weight: 600;
            display: inline-block;
            @media only screen and (max-width: 1300px){
                display: block;
            }
            @media only screen and (max-width: 1199px){
                display: inline-block;
            }
            @media only screen and (max-width: 379px){
                display: block;
            }
        }
        sub{
            bottom: 0;
            ${({ theme }) => (theme.rtl ? "right" : "left")}: 5px;
            font-size: 13px;
            color: ${({ theme }) => theme["light-gray-color"]};
        }
    }

    .session-single{
        text-align: center;
    }
`;

const RegionList = Styled.div`
    max-height: 300px;
    overflow: hidden auto;
    border: 1px solid ${({ theme }) => theme["border-color-light"]};
    table{
        tr{
            &:first-child{
                td{
                    padding-top: 15px;
                }
            }
            &:last-child{
                td{
                    padding-bottom: 15px;
                }
            }
            th{
                font-size: 13px;
                font-weight: 500;
                color: ${({ theme }) => theme["dark-color"]};
                background: ${({ theme }) => theme["bg-color-light"]};
                padding: 9px 20px;
                border: 0 none;
            }
            td{
                font-size: 13px;
                border: 0 none;
                padding: 6px 20px;
                color: ${({ theme }) => theme["gray-color"]};
            }
        }
    }

`;

const RegionMap = Styled.div`
    text-align: center;
    height: 100%;
    ${({ theme }) => (theme.rtl ? "padding-right" : "padding-left")}: 20px;
    .__react_component_tooltip {
        background: ${({ theme }) => theme["dark-color"]};
        border-radius: 3px;
        box-shadow: 0 10px 15px ${({ theme }) => theme["light-color"]}15;
    }
    >div{
        width: 100%;
        height: 250px;
        overflow: hidden;
        @media only screen and (max-width: 479px){
            height: 200px;
        }
    }
    svg{
        width: 450px;
        @media only screen and (max-width: 479px){
            height: 180px;
        }
        @media only screen and (max-width: 440px){
            width: 310px;
        }
        @media only screen and (max-width: 320px){
            width: 280px;
        }
    }
    .controls{
        position: absolute;
        right: 0;
        bottom: 10px;
        button{
            display: block;
            width: 27px;
            height: 27px;
            background: none;
            color: #5a5f7d;
            border: 1px solid #f1f2f6;
            padding: 0;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            cursor: pointer;
            &:first-child{
                border-radius: 6px 6px 0 0;
            }
            &:last-child{
                border-radius: 0 0 6px 6px;
            }
            &:focus{
                outline: none;
            }
            svg{
                width: 10px;
            }
        }
        button + button{
            border-top: 0 none;
        }
    }
`;

const LadingPages = Styled.div`
    @media only screen and (max-width: 1599px){
        min-height: 380px;
    }
    @media only screen and (max-width: 1199px){
        min-height: 100%;
    }
    .ant-table-tbody{
        .ant-table-cell{
            white-space: normal !important;
            @media only screen and (max-width: 991px){
                white-space: nowrap !important;
            }
        }
    }
    table{
        th{
            white-space: nowrap !important;
            text-align: ${({ theme }) =>
              !theme.rtl ? "right" : "left"} !important;
            &:first-child{
                text-align: ${({ theme }) =>
                  theme.rtl ? "right" : "left"} !important;
            }
        }
        tbody{
            tr{
                td{
                    text-align: ${({ theme }) =>
                      !theme.rtl ? "right" : "left"};
                    color: ${({ theme }) => theme["gray-color"]};
                    &:first-child{
                        text-align: ${({ theme }) =>
                          theme.rtl ? "right" : "left"};
                    }
                    .page-title{
                        color: ${({ theme }) => theme["primary-color"]};
                    }
                }
            }
        }
    }
`;

const CardBarChart2 = Styled.div`
    @media only screen and (max-width: 379px){
        text-align: center
    }
    h1{
        margin-bottom: 5px;
    }
    @media only screen and (max-width: 1500px){
        h1{
            font-size: 22px;
        }
    }
    & > span{
        font-size: 14px;
        color: ${({ theme }) => theme["light-gray-color"]};
    }
    p{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 21px 0 0 0;
        @media only screen and (max-width: 379px){
            justify-content: center;
        }
        .growth-upward, .growth-downward{
            display: inline-flex;
            align-items: center;
            ${({ theme }) =>
              !theme.rtl ? "padding-right" : "padding-left"}: 10px;
            font-weight: 600;

            svg{
                width: 15px;
            }
        }
        .growth-upward{
            color: ${({ theme }) => theme["success-color"]};
            svg{
                color: ${({ theme }) => theme["success-color"]};
            }
        }
        .growth-downward{
            color: ${({ theme }) => theme["danger-color"]};
            svg{
                color: ${({ theme }) => theme["danger-color"]};
            }
        }
        span{
            color: ${({ theme }) => theme["light-gray-color"]};
            font-size: 13px;
            display: inline-block;
        }
    }
`;

const SocialMediaWrapper = Styled.div`
    .ant-card-body{
        padding: 12px 25px 10px !important;
    }
`;

const LineChartWrapper = Styled.div`
    .linkedin-chart-wrap{
        min-height: 388px;
    }
    .growth-upward,
    .growth-downward{
        line-height: 2.2;
        h1{
            margin-bottom: 0;
            svg,
            i,
            img{
                margin-right: 6px;
            }
        }
    }
    .line-chart-row{
        &:not(:last-child){
            margin-bottom: 24px;
        }
        .border-linechart{
            border-bottom: 1px solid ${({ theme }) =>
              theme["border-color-deep"]};
            position: relative;
            &:before{
                position: absolute;
                content: '';
                width: 10px;
                height: 2px;
                ${({ theme }) => (theme.rtl ? "right" : "left")}: 0;
                bottom: -1px;
                background: #fff;
            }
        }
    }
    .overview-container{
        .line-chart-row{
            &:not(:last-child){
                margin-bottom: 18px;
                ${({ theme }) =>
                  theme.topMenu
                    ? "margin-bottom: 25px"
                    : "margin-bottom: 18px"};
            }
        }
    }
`;

const RatioCard = Styled.div`
    >.ant-card{
        ${({ theme }) =>
          theme.topMenu ? "min-height: 225px" : "min-height: 100%"};
        @media only screen and (max-width: 1599px){
            min-height: 225px;
        }
    }
    .ant-card-body{
        h1{
            font-size: 16px;
            font-weight: 500;
        }
    }
    .ratio-content{
        margin-top: 30px
        @media only screen and (max-width: 767px){
            margin-top: 25px;
        }
        h1{
            margin-bottom: 2px;
            font-size: 36px;
            font-weight: 600;
            @media only screen and (max-width: 767px){
                font-size: 30px;
            }
        }
        .ant-progress{
            margin-bottom: 12px;
            .ant-progress-bg{
                height: 6px !important;
            }
            .ant-progress-text{
                position: absolute;
                ${({ theme }) => (theme.rtl ? "left" : "right")}: 0;
                bottom: 26px;
                font-weight: 500;
            }
            &.progress-success{
                .ant-progress-text{
                    color: ${({ theme }) => theme["success-color"]};
                }
            }
            &.ant-progress-status-warning{
                .ant-progress-text{
                    color: ${({ theme }) => theme["warning-color"]};
                }
            }
        }
        p{
            color: ${({ theme }) => theme["light-color"]};
            margin-bottom: 0;
            strong{
                font-size: 13px;
                color: ${({ theme }) => theme["dark-color"]};
                font-weight: 600;
            }
        }
    }
`;

const IncomeExpenseWrapper = Styled.div`
    .ant-card-body{
        padding: 0 25px !important;
    }
    .ant-card-extra{
        .card-nav{
            ul{
                padding: 0;
                li{
                    padding: 0;
                }
            }
        }
    }
    canvas{
        padding: 25px 0 0;
        @media only screen and (max-width: 1599px){
            padding-top: 5px;
        }
    }
    .chart-dataIndicator{
        padding: 15px 0 25px 0;
        margin-top: 0 !important;
    }
    ul{
        padding: 10px 0 20px 0;
        margin: -5px -12px;
        li{
            padding: 5px 12px;
            font-size: 13px;
            color: ${({ theme }) => theme["light-gray-color"]};
            @media only screen and (max-width: 575px){
                display: flex !important;
            }
            &:not(:last-child){
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 20px;
                @media only screen and (max-width: 575px){
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 0;
                }
            }
        }
    }
    .chartjs-tooltip{
        min-width: 185px !important;
        @media only screen and (max-width: 1199px){
            min-width: 170px !important;
        }
    }
    .ant-card-extra{
        padding: 0;
    }
`;

const LocationMapWrapper = Styled.div`
    .location-map{
        padding: 10px 0 30px;
        position: relative;
        >div{
            width: 100%;
            height: 160px;
        }
        .controls{
            position: absolute;
            right: 25px;
            bottom: 20px;
            button{
                display: block;
                width: 27px;
                height: 27px;
                background: none;
                color: #5a5f7d;
                border: 1px solid #f1f2f6;
                padding: 0;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                cursor: pointer;
                &:focus{
                    outline: none;
                }
                svg{
                    width: 10px;
                }
            }
            button + button{
                border-top: 0 none;
            }
        }
    }
    .location-table{
        margin: 0 25px 18px;
        padding-top: 12px;
        min-height: 180px;
        border-top: 1px solid ${({ theme }) =>
          theme["border-color-light"]} !important;
        background: #ffffff;
        z-index: 999;
        position: relative;
        &.theme-2{
            min-height: 155px;
        }
        table{
            thead{
                th{
                    font-size: 12px;
                    background: #fff;
                    border: 0 none;
                    font-weight: 400;
                    text-transform: uppercase;
                    color: ${({ theme }) => theme["light-color"]};
                }
            }
            tr{
                &:hover{
                    td{
                        background: #fff;
                    }
                }
                td{
                    border: 0 none;
                    color: ${({ theme }) => theme["gray-color"]};
                }
                th,
                td{
                    padding: 7px 16px;
                    &:first-child{
                        padding-left: 0;
                    }
                    &:last-child{
                        text-align: ${({ theme }) =>
                          theme.rtl ? "left" : "right"};
                        ${({ theme }) =>
                          theme.rtl ? "padding-left" : "padding-right"}: 0;
                    }
                }
            }
        }
    }
`;

const RevenueWrapper = Styled.div`

    .chart-label{
        justify-content: flex-start;
        margin-bottom: 26px;
        display: none
    }

    >.ant-card{
        min-height: 455px;
        @media only screen and (max-width: 1599px){
            min-height: 100%;
        }
    }
    .performance-lineChart{
        ul{
            margin: -25px -25px 20px;
        }
        
        &.theme-2{
            .custom-label{
                .current-amount{
                    color: ${({ theme }) => theme.pink};
                }
            }
        }
    }
    .custom-label{
        flex-direction: column;
        align-items: flex-start;
        margin: 25px;
        .current-amount{
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: ${({ theme }) => theme["primary-color"]};
        }
        .prev-amount{
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: ${({ theme }) => theme["dark-color"]};
        }
        div{
            span{
                display: inline-block;
            }
        }
    }

    .chartjs-tooltip{
        min-width: 166px !important;
        @media only screen and (max-width: 1199px){
            min-width: 150px !important;
        }
    }
`;

const RevenueTableWrapper = Styled.div`

    .full-width-table{
        >.ant-card{
            ${({ theme }) =>
              theme.topMenu ? "min-height: 555px" : "min-height: 500px"};
            @media only screen and (max-width: 1599px){
                min-height: 100%;
            }
        }
    }
    .revenue-table{
        .ant-table-content{
            .ant-table-cell{
                padding: 10px 20px;
                &:first-child{
                    ${({ theme }) =>
                      !theme.rtl ? "padding-left" : "padding-right"}: 25px;
                }
                &:last-child{
                    ${({ theme }) =>
                      theme.rtl ? "padding-left" : "padding-right"}: 25px;
                }
            }
            thead{
                th{
                    font-weight: 500;
                    color: ${({ theme }) => theme["dark-color"]};
                    &:last-child{
                        text-align: left;
                    }
                }
            }
            tbody{
                td{
                    color: ${({ theme }) => theme["gray-color"]};
                }
            }
        }
    }
`;

const RevenueChartWrapper = Styled.div`
    .revenue-chat-label{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .chart-label{
            &:not(:last-child){
                margin-bottom: 18px;
            }
            .label-dot{
                &.dot-Desktop{
                    background: #20C997;
                }
                &.dot-Mobile{
                    background: #5F63F2;
                }
                &.dot-Tablets{
                    background: #FA8B0C;
                }
            }
        }
    }
    .revenue-chart-data{
        p{
            font-size: 18px;
            margin-bottom: 12px;
            &:last-child{
                margin-bottom: 0;
            }
            strong{
                font-weight: 500;
            }
        }
    }
`;

const TrafficTableWrapper = Styled.div`
    min-height: 450px;
    ${({ theme }) =>
      theme.topMenu ? "min-height: 515px" : "min-height: 450px"};
    @media only screen and (max-width: 1599px){
        min-height: 400px;
    }
    @media only screen and (max-width: 1199px){
        min-height: 100%;
    }
    .ant-table-content{
        .ant-table-cell{
            white-space: normal !important;
            @media only screen and (max-width: 991px){
                white-space: nowrap !important;
            }
        }
    }
    table{
        thead{
            tr{
                th{
                    background: #fff;
                    border-top: 1px solid ${({ theme }) =>
                      theme["border-color-light"]};
                    color: ${({ theme }) => theme["dark-color"]}
                    padding: 16px 25px;
                    text-align: ${({ theme }) =>
                      theme.rtl ? "left" : "right"};
                    &:first-child, &:nth-child(5){
                        text-align: ${({ theme }) =>
                          !theme.rtl ? "left" : "right"};
                    }
                }
            }
        }
        tbody{
            tr{
                td{
                    padding: 16px 25px;
                    color: ${({ theme }) => theme["gray-color"]};
                    text-align: ${({ theme }) =>
                      theme.rtl ? "left" : "right"};
                    &:first-child, &:nth-child(5){
                        text-align: ${({ theme }) =>
                          !theme.rtl ? "left" : "right"};
                    }
                }
            }
        }
    }
`;

const Map = Styled.div`
  margin: 1rem auto;
  width: 300px;

  svg {
    stroke: #fff;

    /* // All layers are just path elements */
    path {
      fill: #a82b2b;
      cursor: pointer;
      outline: none;

      /* // When a layer is hovered */
      &:hover {
        fill: rgba(168, 43, 43, 0.83);
      }

      /* // When a layer is focused. */
      &:focus {
        fill: rgba(168, 43, 43, 0.6);
      }

      /* // When a layer is 'checked' (via checkedLayers prop). */
      &[aria-checked='true'] {
        fill: rgba(56, 43, 168, 1);
      }

      /* // When a layer is 'selected' (via currentLayers prop). */
      &[aria-current='true'] {
        fill: rgba(56, 43, 168, 0.83);
      }

      /* // You can also highlight a specific layer via it's id */
      &[id='nz-can'] {
        fill: rgba(56, 43, 168, 0.6);
      }
    }
  }
`;

const ChartContainer = Styled.div`
    display: block;
    font-family: "Raleway";
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: #fff;
        box-shadow: 0 8px 10px #9299B815;
        padding: 10px 12px !important;
        border-radius: 3px;
        border: 1px solid #F1F2F6;
        min-width: 80px;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 1199px){
            padding: 6px 8px !important;
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid #fff;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: 50%;
            transform: translateX(-50%);
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}
        : 10px;
    }
    .tooltip-title {
        color: ${({ theme }) => theme["gray-color"]};
        font-size: 12px;
        font-weight: 500 !important;
        font-family: 'Inter', sans-serif;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
        tbody{
            td{
                font-size: 13px;
                font-weight: 500;
                padding-bottom: 3px;
                white-space: nowrap;
                color: ${({ theme }) => theme["dark-color"]};
                @media only screen and (max-width: 1199px){
                    font-size: 12px;
                }
                .data-label{
                    ${({ theme }) =>
                      theme.rtl ? "margin-right" : "margin-left"}: 3px;
                    color: ${({ theme }) => theme["light-gray-color"]};
                }
            }
        }
    }
`;

const SentEmailWrapper = Styled.div`
    .ant-card-body{
        padding: 30px 25px !important;
    }
    .sent-emial-chart{
        color: #333;
        canvas{
            margin: 0 auto;
        }
    }
    .sent-emial-data{
        margin-top: 30px;
    }
    .sent-emial-box{
        justify-content: space-between;
        @media only screen and (max-width: 575px){
            align-items: flex-start;
            flex-direction: column;
        }
    }
    .sent-emial-item{
        display: flex;
        @media only screen and (max-width: 575px){
            &:not(:last-child){
                margin-bottom: 15px;
            }
        }
        .sent-emial-icon{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 10px;
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
            background-color: ${({ theme }) => theme["primary-color"]}10;
            &.icon-success{
                background-color: ${({ theme }) => theme["success-color"]}10;
            }
            &.icon-primary{
                background-color: ${({ theme }) => theme["primary-color"]}10;
            }
            &.icon-warning{
                background-color: ${({ theme }) => theme["warning-color"]}10;
            }
        }
        .sent-emial-content{
            flex: auto;
            h4{
                font-size: 20px;
                font-weight: 500;
                margin-bottom: 2px;
                strong{
                    font-weight: 500;
                }
            }
            p{
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 0;
                color: ${({ theme }) => theme["gray-color"]};
            }
        }
    }
`;

const RecentDealsWrapper = Styled.div`
    margin-top: 18px;
    min-height: 314px;
    .recent-deals-table{
        .dealing-author{
            display: flex;
            align-items: center;
            img{
                max-width: 36px;
                border-radius: 50%;
            }
            .dealing-author-info{
                ${({ theme }) =>
                  theme.rtl ? "margin-right" : "margin-left"}: 12px;
                h4{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                p{
                    font-size: 13px;
                    color: #9297AF;
                    margin-bottom: 0;
                }
            }
        }
        .deal-amount{
            font-size: 14px;
            font-weight: 600;
            color: ${({ theme }) => theme["dark-color"]};
        }
        .ant-table-tbody > tr > td{
            padding: 7px 25px;
            border-bottom: 0 none;
        }
    }
`;

const SalesTargetWrap = Styled.div`
    .ant-card{
        min-height: 435px;
    }
    .target-progressbar-wrap{
        direction: ltr;
        text-align: center;
        margin-bottom: 70px;
    }
    .s-target-list__item{
        h2{
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        &.target-revinue{
            h2{
                color: ${({ theme }) => theme["success-color"]};
            }
        }
        p{
            margin-bottom: 0;
            color: ${({ theme }) => theme["gray-color"]};
        }
    }
`;

const SalesGrowthWrap = Styled.div`
    @media only screen and (max-width: 1599px){
        min-height: 435px;
        background-color: #fff;
        border-radius: 10px;
    }
    .growth-chart-wrap{
        margin-top: 58px;
    }
    .growth-list__item{
        h2{
            font-size: 22px;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 2px;
        }
        p{
            margin-bottom: 0;
            color: ${({ theme }) => theme["gray-color"]};
        }
    }
`;

const TopSellerWrap = Styled.div`
    .top-seller-table{
        min-height: auto;
        .product-info{
            .product-img{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 15px;
            }
        }
        .ant-table-row {
            .ant-table-cell{
                padding: 15px 15px;
                &:not(first-child){ 
                    text-align: right;
                }
            }
        }
    }
`;

const ProjectListTitle = Styled.div`
    h1{
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 5px;
        a{
            color: ${({ theme }) => theme["dark-color"]};
        }
    }
    p{
        margin: 0;
        font-size: 12px;
        color: ${({ theme }) => theme["gray-solid"]};
    }
`;

export {
  ProjectListTitle,
  ChartContainer,
  DashboardBaseStyleWrap,
  EChartCard,
  Focard,
  CardBarChart,
  CardGroup,
  ExList,
  OverviewCard,
  PerformanceChartWrapper,
  Pstates,
  SessionChartWrapper,
  SessionState,
  RegionMap,
  LadingPages,
  RegionList,
  CardBarChart2,
  SocialMediaWrapper,
  LineChartWrapper,
  RatioCard,
  IncomeExpenseWrapper,
  LocationMapWrapper,
  RevenueWrapper,
  RevenueTableWrapper,
  RevenueChartWrapper,
  TrafficTableWrapper,
  Map,
  SentEmailWrapper,
  RecentDealsWrapper,
  OverviewSalesCard,
  SalesTargetWrap,
  SalesGrowthWrap,
  TopSellerWrap,
};

const ProjectHeader = Styled.div`
    .ant-page-header-heading-sub-title{
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 0;
        position: relative;
        ${({ theme }) => (!theme.rtl ? "padding-left" : "padding-right")}: 15px;
        font-weight: 500;
        &:before{
            position: absolute;
            content: '';
            width: 1px;
            height: 100%;
            background: ${({ theme }) => theme["dash-color"]};
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
            top:0;
        }
    }
`;

const ProjectSorting = Styled.div`
    margin-bottom: 25px;
    .project-sort-bar{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        .project-sort-nav,
        .project-sort-search,
        .project-sort-group{
            padding: 0 10px;
        }

        .project-sort-group{
            ${({ theme }) =>
              theme.rtl ? "margin-right" : "margin-left"}: auto;
        }
        .project-sort-search{
            .ant-select-selection-search{
                width: 100% !important;
            }
        }
    }
    @media (max-width: 1500px){
        .project-sort-search{
            .ant-select{
                width: 237px !important;
            }
        }
        .project-sort-group .sort-group{
            .ant-select{
                min-width: 180px;
            }
        }
    }
    @media (min-width: 1201px) and (max-width: 1300px) {
        .project-sort-search{
            .ant-select{
                width: 170px !important;
            }
        }
        .project-sort-group{
            padding: 0 5px;
            
        }
        .project-sort-group .sort-group .layout-style a{
            width: 35px;
            height: 35px;
        }
        .project-sort-group .sort-group .ant-select {
            min-width: 170px;
            ${({ theme }) =>
              !theme.rtl ? "padding-left" : "padding-right"}: 5px;
            ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 5px;
        }
    }
    @media (max-width: 1199px){
        .project-sort-search{
            flex: 0 0 100%;
            order: 0;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            .ant-select{
                width: 350px !important;
            }
        }
        .project-sort-nav{
            order: 1;
            margin: 0 auto;
        }
        .project-sort-group{
            order: 2;
        }
    }
    @media (max-width: 991px){
        .project-sort-group{
            ${({ theme }) =>
              theme.rtl ? "margin-right" : "margin-left"}: unset;
            flex: 0 0 100%;
            margin-top: 15px;
            .sort-group{
                justify-content: flex-start;
                .layout-style{
                    ${({ theme }) =>
                      theme.rtl ? "margin-right" : "margin-left"}: auto;
                }
            }
        }
    }
    @media (max-width: 575px){
        .project-sort-group{
            .sort-group{
                > span{
                    display: none;
                }
                .ant-select{
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 0;
                }
            }
        }
    }

    nav{
        background: #fff;
        border-radius: 5px;
        padding: 9px 20px;
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 12px;
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 11px;
                ${({ theme }) =>
                  theme.rtl ? "border-left" : "border-right"}: 1px solid ${({
  theme,
}) => theme["border-color-light"]};
                &:last-child{
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 0;
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 0;
                    ${({ theme }) =>
                      theme.rtl ? "border-left" : "border-right"}: 0 none;
                }
                a{
                    color: ${({ theme }) => theme["gray-solid"]};
                    font-weight: 400;
                }
                &.active{
                    a{
                        color: ${({ theme }) => theme["primary-color"]};
                    }
                }
            }
        }
    }
    .ant-select-selection-search-input{
        border: 0 none;
        border-radius: 23px;
        input{
            height: 40px !important;
            border-radius: 23px;
        }
    }
    .ant-select-arrow{
        right: auto;
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 11px !important;
    }
    
    .sort-group{
        color: ${({ theme }) => theme["gray-solid"]};
        display: flex;
        align-items: center;
        justify-content: flex-end;

               
        .ant-select{
            ${({ theme }) =>
              !theme.rtl ? "padding-left" : "padding-right"}: 10px;
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: 15px;
            min-width: 260px;
            .ant-select-selector{
                border: 0 none;
                .ant-select-selection-item{                    
                    color: ${({ theme }) => theme["gray-solid"]};
                }
                
            }
        }
        .layout-style{
            display: flex;
            align-items: center;
            ${({ theme }) =>
              theme.rtl ? "margin-right" : "margin-left"}: 20px;
            a{
                display: flex;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                color: ${({ theme }) => theme["gray-solid"]};
                &:hover,
                &.active{
                    color: ${({ theme }) => theme["primary-color"]};
                    background: #fff;
                }
            }
        }
    }
    @media (max-width: 400px){
        .sort-group .ant-select{
            min-width: 200px;
        }
        .project-sort-search{
            .ant-select-auto-complete{
                width: 100% !important;
            }
        }
        .project-sort-nav{
            nav{
                padding: 10px;
            }
            nav ul{
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: -5px;
                li{
                    ${({ theme }) =>
                      theme.rtl ? "border-left" : "border-right"}: 0 none;
                    margin-bottom: 5px;
                }
            }
        }
    }
`;

const ProjectCard = Styled.div`
    .ant-card-body{
        padding: 0px !important;
    }
    .project-top{
        padding:30px 30px 0px;
    }
    .project-bottom{
        .project-assignees{
            padding: 16px 30px 25px;
        }
    }
    .project-title{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        h1{
            font-size: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: -2px;
            a{
                color: ${({ theme }) => theme["dark-color"]};
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 11px !important;
            }
            a,
            .ant-tag{
                margin: 2px;
            }
            .ant-tag{
                text-transform: uppercase;
                font-size: 10px;
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 0;
                line-height: 18px;
                background: red;
                color: #fff;
                border: 0 none;
                &.early{
                    background: ${({ theme }) => theme["primary-color"]};
                }
                &.progress{
                    background: ${({ theme }) => theme["danger-color"]};
                }
                &.late{
                    background: ${({ theme }) => theme["warning-color"]};
                }
                &.complete{
                    background: ${({ theme }) => theme["success-color"]};
                }
            }
        }
        .ant-dropdown-trigger{
            color: ${({ theme }) => theme["extra-light-color"]};
        }
    }
    .project-desc{
        margin: 7px 0 25px 0;
        color: ${({ theme }) => theme["gray-color"]};
    }
    .project-timing{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        div{
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 30px;
            &:last-child{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 0;
            }
            span, strong{
                display: block;
            }
            span{
                font-size: 12px;
                margin-bottom: 2px;
                color: ${({ theme }) => theme["gray-solid"]};
            }
            strong{
                font-weight: 500;
            }
        }
    }
    .project-progress{
        p{
            margin: 2px 0 0 0;
            color: ${({ theme }) => theme["gray-solid"]};
            font-size: 12px;
        }
        .ant-progress-text{
            font-size: 12px;
            font-weight: 500;
        }
    }
    .project-assignees{
        border-top: 1px solid ${({ theme }) => theme["border-color-light"]};
        margin-top: 17px;
        padding-top: 16px;
        p{
            font-size: 13px;
            color: ${({ theme }) => theme["gray-solid"]}
        }
        ul{
            margin: -3px;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            li{
                list-style: none;
                padding: 3px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
    }
`;

const ProjectPagination = Styled.div`
    .ant-pagination{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 767px) {
            justify-content: center;
        }
    }
`;

const ProjectListAssignees = Styled.div`
    ul{
        margin: -3px;
        padding: 0;
        display: flex;
        align-items: center;
        li{
            list-style: none;
            padding: 3px;
            img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
    }
`;

const ProjectList = Styled.div`

    .project-list-progress{
        p{
            margin: 4px 0 0 0;
            font-size: 12px;
            color: ${({ theme }) => theme["gray-solid"]};
        }
    }
    .date-started,
    .date-finished{
        font-weight: 500;
    }
    .ant-table{
        .ant-table-thead{
            th{
                background-color: ${({ theme }) => theme["bg-color-light"]};
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({ theme }) =>
                          theme["bg-color-light"]};
                    }
                }
            }
        }
    }
    .ant-table-container table > thead > tr th{
        font-weight: 400;
        color: ${({ theme }) => theme["light-color"]};
        border-top: 1px solid ${({ theme }) => theme["border-color-light"]};
    }
    .ant-table-container table > thead > tr th:first-child{
        border-radius: ${({ theme }) =>
          theme.rtl ? "0 10px 10px 0" : "10px 0 0 10px"} !important;
        ${({ theme }) =>
          !theme.rtl ? "border-left" : "border-right"}: 1px solid ${({
  theme,
}) => theme["border-color-light"]};
    }
    .ant-table-container table > thead > tr th:last-child{
        border-radius: ${({ theme }) =>
          !theme.rtl ? "0 10px 10px 0" : "10px 0 0 10px"} !important;
        ${({ theme }) =>
          theme.rtl ? "border-left" : "border-right"}: 1px solid ${({
  theme,
}) => theme["border-color-light"]};
    }
    .ant-dropdown-trigger{
        svg{
            color: ${({ theme }) => theme["extra-light-color"]};
        }
    }
`;

const ProjectDetailsWrapper = Styled.div`
    .project-header{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 800px) {
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            button{
                margin: 15px 0 0;
            }
        }
        h1{
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 20px;
            margin-bottom: 0;
            font-size: 20px;
            @media only screen and (max-width: 800px) {
                margin-bottom: 10px;
            }
            @media only screen and (max-width: 575px) {
                margin: 0;
            }
        }
        button{
            font-size: 12px;
            font-weight: 500;
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
            height: 35px;
            padding: 0px 13.5px;
            &.btn-markComplete{
                background: #fff;
                border-color: ${({ theme }) => theme["border-color-deep"]};
            }
        }
    }
    .project-action{
        .project-edit,
        .project-remove{
            border-radius: 6px;
            background: #fff;
            height: 35px;
            padding: 0 15px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            box-shadow: 0 3px 5px ${({ theme }) => theme["gray-solid"]}05;
            svg,
            img{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 6px;
            }
        }
        .project-edit{
            color: ${({ theme }) => theme["primary-color"]};
        }
        .project-remove{
            color: ${({ theme }) => theme["danger-color"]};
        }
    }
    .project-progress{
        border-radius: 10px;
        background: ${({ theme }) => theme["success-color"]};
        padding: 20px 25px 20px;
        margin-bottom: 25px;
        h3{
            color: #fff;
        }
        .ant-progress-inner{
            background: rgba(255,255,255, 0.2);
        }
        .ant-progress-bg{
            background: #fff;
        }
        .ant-progress-text{
            color: #fff;
            font-weight: 500;
        }
    }
    .about-project-wrapper{
        min-height: 485px;
        background: #fff;
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .state-single{
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        &:last-child{
            margin-bottom: 0;
        }
        > div{
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 20px;
        }
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: rgba(95,99,242,0.1);
        }
        h1{
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 3px;
        }
        p{
            color: ${({ theme }) => theme["gray-solid"]};
            margin: 0;
        }
        .color-primary{
            a{
                background: rgba(95,99,242,0.1);
                svg{
                    color: ${({ theme }) => theme["primary-color"]};
                }
            }
        }
        .color-secondary{
            a{
                background: rgba(255,105,165,0.1);
                svg{
                    color: ${({ theme }) => theme["secondary-color"]};
                }
            }
        }
        .color-success{
            a{
                background: rgba(32,201,151,0.1);
                svg{
                    color: ${({ theme }) => theme["success-color"]};
                }
            }
        }
        .color-warning{
            a{
                background: rgba(250,139,12,0.1);
                svg{
                    color: ${({ theme }) => theme["warning-color"]};
                }
            }
        }
    }
    .about-content{
        p{
            font-size: 15px;
            line-height: 25px;
            color: ${({ theme }) => theme["gray-color"]};
        }
    }
    .about-project{
        margin: 42px -40px 0;
        display: flex;
        align-items: center;
        @media only screen and (max-width: 991px) {
            flex-flow: column;
            align-items: flex-start;
        }
        div{
            margin: 0 40px;
            span{
                color: ${({ theme }) => theme["gray-solid"]};
                font-size: 13px;
                display: block;
                margin-bottom: 3px;
            }
            p{
                font-weight: 500;
            }
        }
    }
    .project-users-wrapper{
        .btn-addUser{
            padding: 0px 12.6px;
            font-size: 12px;
            font-weight: 500;
            border-color: ${({ theme }) => theme["border-color-light"]};
        }
        i +span, svg +span, img +span {
            ${({ theme }) => (theme.rtl ? "margin-right" : "margin-left")}: 6px;
        }
    }
    .project-users{
        min-height: 368px;
        .porject-user-single{
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            &:last-child{
                margin-bottom: 0;
            }
            & > div{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 15px;
            }
            div{
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: block;
                }
                h1{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                p{
                    color: ${({ theme }) => theme["gray-solid"]};
                    margin: 0;
                }
            }
        }
    }

    .file-list{
        min-height: 385px;
        .file-list__single{
            justify-content: space-between;
            align-items: center;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                display: block;
                font-size: 12px;
                line-height: 1.42;
                &.file-name{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({ theme }) => theme["dark-color"]};
                }
                &.file-size{
                    margin: 2px 0;;
                    color: ${({ theme }) => theme["gray-solid"]};
                }
                &.file-content-action{
                    a{
                        font-weight: 500;
                        color: ${({ theme }) => theme["primary-color"]};
                    }
                    a + a{
                        margin-left: 8px;
                    }
                }
            }
        }
        .file-single-info{
            width: 50%;
            align-items: center;
            .file-single-logo{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 16px;
                img{
                    max-width: 42px;
                }
            }
        }
        .file-single-action{
            .ant-dropdown-trigger {
                color: ${({ theme }) => theme["extra-light-color"]};
            }
        }
    }

    .dropdown-more{
        a{
            font-size: 13px;
            svg,
            i.
            img{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 8px;
            }
        }
    }
`;

const TaskLists = Styled.div`
    .ant-card{
        .ant-card-head{
            border-color: ${({ theme }) => theme["border-color-light"]};
            margin-bottom: 0;
        }
        .ant-card-body{
            padding: 0 !important;
        }
    }
    nav{
        a{
            font-size: 14px;
            font-weight: 500;
            color: ${({ theme }) => theme["gray-solid"]};
            position: relative;
            padding: 20px 0px;
            &:not(:last-child){
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 18px;
            }
            &:before{
                position: absolute;
                content: '';
                width: 100%;
                ${({ theme }) => (theme.rtl ? "right" : "left")}: 0;
                bottom: -2px;
                height: 1px;

            }
            &.active{
                color: ${({ theme }) => theme["primary-color"]};
                &:before{
                    background: ${({ theme }) => theme["primary-color"]};
                }
            }
        }
    }
    table{
        margin-top: 15px;
        .ant-checkbox-checked{
            .ant-checkbox-inner{
                background: ${({ theme }) => theme["success-color"]};
                border-color: ${({ theme }) => theme["success-color"]};
            }
            &:after{
                border-color: ${({ theme }) => theme["success-color"]};
            }
        }
        thead{
            display: none;
        }
        tr{
            th{
                background: #fff;
                border-bottom: 0;
                padding: 10px;
                &:first-child{
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 25px;
                }
                .ant-checkbox-indeterminate {
                    .ant-checkbox-inner{
                        &:after{
                            background: ${({ theme }) =>
                              theme["success-color"]};
                        }
                    }
                }
            }
            &:hover{
                td{
                    background: #fff;
                }
            }
        }
        .ant-table-tbody{
            > tr.ant-table-row{
                &.ant-table-row-selected{
                    > td{
                        background: #fff;
                    }
                    .task-title{
                        text-decoration: line-through;
                    }
                }
                > td{
                    padding: 10px;
                    border-bottom: 0;
                    text-align: ${({ theme }) =>
                      theme.rtl ? "right" : "left"};
                    &:first-child{
                        ${({ theme }) =>
                          !theme.rtl ? "padding-left" : "padding-right"}: 25px;
                    }
                    &:last-child{
                        ${({ theme }) =>
                          theme.rtl ? "padding-left" : "padding-right"}: 25px;
                    }
                    .task-title{
                        color: ${({ theme }) => theme["gray-color"]};
                    }
                    .task-created{
                        font-size: 12px;
                        color: ${({ theme }) => theme["gray-color"]};
                    }
                    .ant-checkbox{
                        &:hover{
                            .ant-checkbox-inner{
                                border-color: ${({ theme }) =>
                                  theme["success-color"]};
                            }
                        }
                    }
                }
                &:hover{
                    box-shadow: 0 15px 50px ${({ theme }) =>
                      theme["gray-solid"]}20;
                    > td{
                        background: #fff;
                    }
                }
            }
        }
    }

    .tasklist-action{
        margin: 18px 25px 25px;
        button{
            width: 100%;
            text-align: ${({ theme }) => (theme.rtl ? "right" : "left")};
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 500;
            &.ant-btn-primary{
                border-radius: 6px;
                background: ${({ theme }) => theme["primary-color"]}10;
            }
        }
    }
`;

const TasklistAction = Styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 -10px;
    span, img, div{
        display: block;
        margin: 0 10px;
        line-height: normal;
    }
    span, a{
        color: ${({ theme }) => theme["gray-solid"]};
    }
    .task-created{
        color: #9299b8 !important;
    }
    .task-move{
        svg,
        i{
            color: #D8DCEB;
        }
    }
`;

const ActivitiesWrapper = Styled.div`
    padding: 25px;
    min-height: 435px;
    .activity-block{
        &:not(:last-child){
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid ${({ theme }) =>
              theme["border-color-light"]};
        }
    }
    .activity-dateMeta{
        height: 100%;
        border-radius: 10px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        background: ${({ theme }) => theme["bg-color-light"]};
        border: 1px solid ${({ theme }) => theme["border-color-light"]};
        @media only screen and (max-width: 575px) {
            height: auto;
            padding: 30px 0px;
            margin-bottom: 25px;
        }
        h1{
            font-size: 18px;
            margin-bottom: 0px;
        }
        .activity-month{
            color: ${({ theme }) => theme["gray-color"]};
        }
    }

    .activity-single{
        &:not(:last-child){
            margin-bottom: 25px;
        }
        .activity-icon{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin: ${({ theme }) =>
              theme.rtl ? "4px 0 0 10px" : "4px 10px 0 0"};
            &.bg-primary{
                background: ${({ theme }) => theme["primary-color"]}15;
                color: ${({ theme }) => theme["primary-color"]};
            }
            &.bg-secondary{
                background: ${({ theme }) => theme["secondary-color"]}15;
                color: ${({ theme }) => theme["secondary-color"]};
            }
            &.bg-success{
                background: ${({ theme }) => theme["success-color"]}15;
                color: ${({ theme }) => theme["success-color"]};
            }
        }
        img{
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 12px;
        }
        .activity-title{
            font-size: 14px;
            font-weight: 500;
            margin: -4px 0 0;
            span{
                font-weight: 400;
                margin: 0 2px;
                color: ${({ theme }) => theme["gray-solid"]};
            }
        }
        .activity-timeMeta{
            font-size: 12px;
            margin-bottom: 0;
            color: ${({ theme }) => theme["extra-light-color"]};
        }
    }
`;

export {
  ProjectHeader,
  ProjectSorting,
  ProjectCard,
  ProjectPagination,
  ProjectListAssignees,
  ProjectList,
  ProjectDetailsWrapper,
  TaskLists,
  TasklistAction,
  ActivitiesWrapper,
};
