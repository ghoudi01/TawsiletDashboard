import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query UsersPermissionsUsers_connection(
    $filters: UsersPermissionsUserFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    usersPermissionsUsers_connection(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      nodes {
        documentId
        email
        user_role
        phoneNumber
        username
        firstName
        lastName
        createdAt
        updatedAt
        confirmed
        blocked
        profilePicture{url}
        id
      }
      pageInfo {
        page
        pageSize
        total
      }
    }
  }
`;

export const GET_VEHICULES_LIST = gql`
  query Vehicules {
    vehicules {
      color
      createdAt
      matriculation
      model
      assuranceDate
      documentId
      year
      mark
      assurancePictures {
        url
      }
      grayCardPictures {
        url
      }
      vehiculePictureface1 {
        url
      }
      vehiculePictureface2 {
        url
      }
      vehiculePictureface3 {
        url
      }
      vehiculePictureface4 {
        url
      }
    }
  }
`;

export const GET_COMPANIES_LIST = gql`
  query Companies_connection(
    $pagination: PaginationArg
    $status: PublicationStatus
    $filters: CompanyFiltersInput
    $sort: [String]
  ) {
    companies_connection(
      pagination: $pagination
      status: $status
      filters: $filters
      sort: $sort
    ) {
      nodes {
       

        activity
        address
        category
        city
        confirmed
        country
        createdAt
        documentId
        logo {
          url
          width
          size
          previewUrl
          height
          formats
          alternativeText
        }
        name
        postalCode
        region
        verified
        owner {
          address
          blocked
          confirmed
          createdAt
          documentId
          firstName
          email
          lastName
          phoneNumber
        }
        publishedAt
      }
      pageInfo {
        page
        pageCount
        pageSize
        total
      }
    }
  }
`;

export const GET_COMPANY_DETAILS_BY_ID = gql`
  query Company($documentId: ID!) {
    company(documentId: $documentId) {
      vehicules {
        documentId
        mark
        matriculation
        model
        validation {
          validation_state
          id
          description
        }
        year
         
        vehiculePictureface1 {
          url
        }
        vehiculePictureface2 {
          url
        }
        vehiculePictureface3 {
          url
        }
        vehiculePictureface4 {
          url
        }
      }
      Documents {
        ... on ComponentCountryDocumentsTunisia {
          assurance_expiration_date
          attestation_cnss {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          attestation_fiscale {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          cin_recto_picture {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          cin_verso_picture {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          id
          licence_transport {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          licence_transport_expiration_date
          rib {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
          rne {
            id
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
          }
        }
        ... on ComponentCountryDocumentsIndividual {
          assurance_expiration_date
          assurance_rc_pro {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          attestation_cnss {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          attestation_fiscale {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          carte_professionnelle {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          carte_professionnelle_transport {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          cin_recto_picture {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          cin_verso_picture {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
          id
          licence_transport_expiration_date
          rib {
            pictureDetails {
              url
              width
              size
              previewUrl
              height
              formats
              alternativeText
            }
            Description
            isVAlid
            id
          }
        }
      }
      activity
      address
      category
      city
      confirmed
      country
      createdAt
      documentId
      logo {
        url
        width
        size
        previewUrl
        height
        formats
        alternativeText
      }
      name
      postalCode
      region
      verified
      owner {
        address
        blocked
        confirmed
        createdAt
        documentId
        firstName
        email
        lastName
        phoneNumber
      }
      publishedAt
    }
  }
`;
